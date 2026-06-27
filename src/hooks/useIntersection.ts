"use client";

import { useState, useCallback, useRef } from "react";
import {
  SelectedPerson,
  TMDBPersonMovieCredits,
  TMDBMovieDetail,
  TMDBDiscoverResult,
  MovieInfo,
  IntersectionResult,
} from "@/lib/types";
import { tmdbFetch } from "@/lib/tmdb-client";
import { computeIntersections, movieListToMap, IntersectionSets } from "@/lib/intersection";

function toMovieInfo(detail: TMDBMovieDetail): MovieInfo {
  const directors = (detail.credits?.crew ?? [])
    .filter((c) => c.job === "Director")
    .map((c) => c.name);

  const topCast = (detail.credits?.cast ?? [])
    .sort((a, b) => a.order - b.order)
    .slice(0, 3)
    .map((c) => c.name);

  const trailer = (detail.videos?.results ?? []).find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  return {
    id: detail.id,
    title: detail.title || detail.original_title,
    originalTitle: detail.original_title,
    releaseDate: detail.release_date,
    posterPath: detail.poster_path,
    genres: detail.genres,
    voteAverage: detail.vote_average,
    runtime: detail.runtime,
    directors,
    topCast,
    trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
  };
}

async function fetchMovieDetails(
  movieIds: number[],
  signal: AbortSignal
): Promise<MovieInfo[]> {
  const results: MovieInfo[] = [];
  const batchSize = 5;

  for (let i = 0; i < movieIds.length; i += batchSize) {
    if (signal.aborted) break;

    const batch = movieIds.slice(i, i + batchSize);
    const details = await Promise.all(
      batch.map((id) =>
        tmdbFetch<TMDBMovieDetail>(
          `movie/${id}`,
          { append_to_response: "videos,credits" },
          signal
        )
      )
    );

    results.push(...details.map(toMovieInfo));

    // Small delay between batches to respect rate limits
    if (i + batchSize < movieIds.length) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  return results;
}

export function useIntersection() {
  const [results, setResults] = useState<IntersectionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(
    async (
      director: SelectedPerson | null,
      actor: SelectedPerson | null,
      genreId: number | null,
      genreName: string | null
    ) => {
      // Abort previous
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);
      setResults([]);

      try {
        // Genre-only case: use discover API
        if (!director && !actor && genreId) {
          const data = await tmdbFetch<TMDBDiscoverResult>(
            "discover/movie",
            {
              with_genres: String(genreId),
              sort_by: "popularity.desc",
            },
            controller.signal
          );

          const movieIds = data.results.slice(0, 20).map((m) => m.id);
          const movies = await fetchMovieDetails(movieIds, controller.signal);

          if (!controller.signal.aborted) {
            setResults([
              {
                label: `${genreName ?? "장르"} 인기 영화`,
                movies,
              },
            ]);
          }
          return;
        }

        // Fetch credits in parallel
        const [directorCredits, actorCredits] = await Promise.all([
          director
            ? tmdbFetch<TMDBPersonMovieCredits>(
                `person/${director.id}/movie_credits`,
                {},
                controller.signal
              )
            : null,
          actor
            ? tmdbFetch<TMDBPersonMovieCredits>(
                `person/${actor.id}/movie_credits`,
                {},
                controller.signal
              )
            : null,
        ]);

        if (controller.signal.aborted) return;

        // Build movie sets
        const directorMovies = directorCredits
          ? directorCredits.crew.filter((c) => c.job === "Director")
          : null;
        const actorMovies = actorCredits ? actorCredits.cast : null;

        const directorIds = directorMovies
          ? new Set(directorMovies.map((m) => m.id))
          : null;
        const actorIds = actorMovies
          ? new Set(actorMovies.map((m) => m.id))
          : null;

        // Build combined movie map for genre filtering
        const allMovies = [
          ...(directorMovies ?? []),
          ...(actorMovies ?? []),
        ];
        const allMovieMap = movieListToMap(allMovies);

        const intersections = computeIntersections(
          directorIds,
          actorIds,
          genreId,
          allMovieMap
        );

        // Build result sections
        const sections = buildSections(
          intersections,
          director,
          actor,
          genreName
        );

        // Collect all unique movie IDs
        const allIds = new Set<number>();
        for (const section of sections) {
          for (const id of section.ids) {
            allIds.add(id);
          }
        }

        if (allIds.size === 0) {
          if (!controller.signal.aborted) {
            setResults(
              sections.map((s) => ({ label: s.label, movies: [] }))
            );
          }
          return;
        }

        // Fetch details
        const details = await fetchMovieDetails(
          Array.from(allIds),
          controller.signal
        );
        const detailMap = new Map(details.map((d) => [d.id, d]));

        if (!controller.signal.aborted) {
          setResults(
            sections.map((s) => ({
              label: s.label,
              movies: Array.from(s.ids)
                .map((id) => detailMap.get(id))
                .filter((m): m is MovieInfo => m !== undefined)
                .sort(
                  (a, b) =>
                    new Date(b.releaseDate).getTime() -
                    new Date(a.releaseDate).getTime()
                ),
            }))
          );
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Intersection search failed:", err);
          if (!controller.signal.aborted) {
            setError("검색 중 오류가 발생했습니다. 다시 시도해 주세요.");
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    []
  );

  return { results, loading, error, search };
}

interface SectionDef {
  label: string;
  ids: Set<number>;
}

function buildSections(
  intersections: IntersectionSets,
  director: SelectedPerson | null,
  actor: SelectedPerson | null,
  genreName: string | null
): SectionDef[] {
  const sections: SectionDef[] = [];
  const dName = director?.name ?? "";
  const aName = actor?.name ?? "";
  const gName = genreName ?? "";

  if (intersections.directorActorGenre) {
    sections.push({
      label: `${dName} ∩ ${aName} ∩ ${gName}`,
      ids: intersections.directorActorGenre,
    });
  }
  if (intersections.directorActor) {
    sections.push({
      label: `${dName} ∩ ${aName}`,
      ids: intersections.directorActor,
    });
  }
  if (intersections.directorGenre) {
    sections.push({
      label: `${dName} ∩ ${gName}`,
      ids: intersections.directorGenre,
    });
  }
  if (intersections.actorGenre) {
    sections.push({
      label: `${aName} ∩ ${gName}`,
      ids: intersections.actorGenre,
    });
  }
  if (intersections.directorOnly) {
    sections.push({
      label: `${dName} 필모그래피`,
      ids: intersections.directorOnly,
    });
  }
  if (intersections.actorOnly) {
    sections.push({
      label: `${aName} 필모그래피`,
      ids: intersections.actorOnly,
    });
  }

  return sections;
}
