import { TMDBMovieSummary, TMDBCastCredit, TMDBCrewCredit } from "./types";

type MovieLike = TMDBMovieSummary | TMDBCastCredit | TMDBCrewCredit;

export function intersectSets(a: Set<number>, b: Set<number>): Set<number> {
  const result = new Set<number>();
  for (const id of a) {
    if (b.has(id)) {
      result.add(id);
    }
  }
  return result;
}

export function movieListToMap(
  movies: MovieLike[]
): Map<number, MovieLike> {
  const map = new Map<number, MovieLike>();
  for (const movie of movies) {
    map.set(movie.id, movie);
  }
  return map;
}

export function filterByGenre(
  movieIds: Set<number>,
  movieMap: Map<number, MovieLike>,
  genreId: number
): Set<number> {
  const result = new Set<number>();
  for (const id of movieIds) {
    const movie = movieMap.get(id);
    if (movie && movie.genre_ids.includes(genreId)) {
      result.add(id);
    }
  }
  return result;
}

export interface IntersectionSets {
  directorOnly?: Set<number>;
  actorOnly?: Set<number>;
  genreOnly?: Set<number>;
  directorActor?: Set<number>;
  directorGenre?: Set<number>;
  actorGenre?: Set<number>;
  directorActorGenre?: Set<number>;
}

export function computeIntersections(
  directorMovieIds: Set<number> | null,
  actorMovieIds: Set<number> | null,
  genreId: number | null,
  allMovieMap: Map<number, MovieLike>
): IntersectionSets {
  const result: IntersectionSets = {};

  const hasDirector = directorMovieIds !== null && directorMovieIds.size > 0;
  const hasActor = actorMovieIds !== null && actorMovieIds.size > 0;
  const hasGenre = genreId !== null;

  if (hasDirector && hasActor && hasGenre) {
    // 3 inputs: compute all combinations
    const da = intersectSets(directorMovieIds!, actorMovieIds!);
    const dg = filterByGenre(directorMovieIds!, allMovieMap, genreId!);
    const ag = filterByGenre(actorMovieIds!, allMovieMap, genreId!);
    const dag = intersectSets(da, dg);

    result.directorActorGenre = dag;
    result.directorActor = da;
    result.directorGenre = dg;
    result.actorGenre = ag;
  } else if (hasDirector && hasActor) {
    result.directorActor = intersectSets(directorMovieIds!, actorMovieIds!);
  } else if (hasDirector && hasGenre) {
    result.directorGenre = filterByGenre(
      directorMovieIds!,
      allMovieMap,
      genreId!
    );
  } else if (hasActor && hasGenre) {
    result.actorGenre = filterByGenre(actorMovieIds!, allMovieMap, genreId!);
  } else if (hasDirector) {
    result.directorOnly = directorMovieIds!;
  } else if (hasActor) {
    result.actorOnly = actorMovieIds!;
  }
  // genreOnly is handled separately via discover API

  return result;
}
