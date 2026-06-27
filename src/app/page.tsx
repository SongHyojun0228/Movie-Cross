"use client";

import { useState, useCallback } from "react";
import { usePersonSearch } from "@/hooks/usePersonSearch";
import { useGenres } from "@/hooks/useGenres";
import { useIntersection } from "@/hooks/useIntersection";
import SearchPanel from "@/components/SearchPanel";
import ResultsSection from "@/components/ResultsSection";

export default function Home() {
  const directorSearch = usePersonSearch();
  const actorSearch = usePersonSearch();
  const { genres, loading: genresLoading } = useGenres();
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const { results, loading, error, search } = useIntersection();

  const handleSearch = useCallback(() => {
    const genreName =
      selectedGenreId !== null
        ? genres.find((g) => g.id === selectedGenreId)?.name ?? null
        : null;

    search(
      directorSearch.selected,
      actorSearch.selected,
      selectedGenreId,
      genreName
    );
  }, [
    directorSearch.selected,
    actorSearch.selected,
    selectedGenreId,
    genres,
    search,
  ]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/8 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              <span className="text-accent">M</span>ovie{" "}
              <span className="text-accent">C</span>ross
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted sm:text-base">
              감독, 주연, 장르를 조합하여 영화의 교집합을 찾아보세요
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <SearchPanel
          directorSearch={directorSearch}
          actorSearch={actorSearch}
          genres={genres}
          genresLoading={genresLoading}
          selectedGenreId={selectedGenreId}
          onGenreSelect={setSelectedGenreId}
          onSearch={handleSearch}
          searching={loading}
        />

        <ResultsSection results={results} loading={loading} error={error} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6 text-center text-xs text-dim">
        Powered by TMDB API
      </footer>
    </div>
  );
}
