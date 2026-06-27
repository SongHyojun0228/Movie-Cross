"use client";

import { TMDBGenre } from "@/lib/types";
import { usePersonSearch } from "@/hooks/usePersonSearch";
import PersonSearchInput from "./PersonSearchInput";
import GenreSelector from "./GenreSelector";

interface Props {
  directorSearch: ReturnType<typeof usePersonSearch>;
  actorSearch: ReturnType<typeof usePersonSearch>;
  genres: TMDBGenre[];
  genresLoading: boolean;
  selectedGenreId: number | null;
  onGenreSelect: (id: number | null) => void;
  onSearch: () => void;
  searching: boolean;
}

export default function SearchPanel({
  directorSearch,
  actorSearch,
  genres,
  genresLoading,
  selectedGenreId,
  onGenreSelect,
  onSearch,
  searching,
}: Props) {
  const hasAnyInput =
    directorSearch.selected !== null ||
    actorSearch.selected !== null ||
    selectedGenreId !== null;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-2xl shadow-black/40">
      <div className="grid gap-4 sm:grid-cols-3">
        <PersonSearchInput
          label="감독"
          placeholder="감독 이름 검색..."
          query={directorSearch.query}
          setQuery={directorSearch.setQuery}
          results={directorSearch.results}
          loading={directorSearch.loading}
          showSuggestions={directorSearch.showSuggestions}
          setShowSuggestions={directorSearch.setShowSuggestions}
          selected={directorSearch.selected}
          noResults={directorSearch.noResults}
          onSearch={directorSearch.search}
          onSelect={directorSearch.selectPerson}
          onClear={directorSearch.clear}
        />
        <PersonSearchInput
          label="주연"
          placeholder="배우 이름 검색..."
          query={actorSearch.query}
          setQuery={actorSearch.setQuery}
          results={actorSearch.results}
          loading={actorSearch.loading}
          showSuggestions={actorSearch.showSuggestions}
          setShowSuggestions={actorSearch.setShowSuggestions}
          selected={actorSearch.selected}
          noResults={actorSearch.noResults}
          onSearch={actorSearch.search}
          onSelect={actorSearch.selectPerson}
          onClear={actorSearch.clear}
        />
        <GenreSelector
          genres={genres}
          loading={genresLoading}
          selectedGenreId={selectedGenreId}
          onSelect={onGenreSelect}
        />
      </div>
      <div className="mt-5 flex justify-center">
        <button
          onClick={onSearch}
          disabled={!hasAnyInput || searching}
          className="min-w-[160px] rounded-lg bg-accent px-8 py-2.5 text-sm font-semibold text-white tracking-wide uppercase transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none"
        >
          {searching ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              검색 중
            </span>
          ) : (
            "검색"
          )}
        </button>
      </div>
    </div>
  );
}
