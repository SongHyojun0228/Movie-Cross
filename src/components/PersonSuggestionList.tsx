"use client";

import { TMDBPerson } from "@/lib/types";

interface Props {
  results: TMDBPerson[];
  onSelect: (person: TMDBPerson) => void;
  noResults: boolean;
}

export default function PersonSuggestionList({ results, onSelect, noResults }: Props) {
  if (noResults) {
    return (
      <div className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-surface-light p-3 text-sm text-muted shadow-xl shadow-black/50">
        검색 결과가 없습니다. 영어 이름으로도 검색해 보세요.
      </div>
    );
  }

  if (results.length === 0) return null;

  return (
    <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-border bg-surface-light shadow-xl shadow-black/50">
      {results.map((person) => (
        <li key={person.id}>
          <button
            type="button"
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-surface-hover"
            onClick={() => onSelect(person)}
          >
            {person.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w45${person.profile_path}`}
                alt={person.name}
                className="h-10 w-8 rounded object-cover"
              />
            ) : (
              <div className="flex h-10 w-8 items-center justify-center rounded bg-border text-xs text-dim">
                ?
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-white">
                {person.name}
              </div>
              <div className="text-xs text-dim">
                {person.known_for_department}
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
