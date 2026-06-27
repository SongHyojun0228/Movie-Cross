"use client";

import { useRef, useEffect, useCallback } from "react";
import { TMDBPerson, SelectedPerson } from "@/lib/types";
import PersonSuggestionList from "./PersonSuggestionList";

interface Props {
  label: string;
  placeholder: string;
  query: string;
  setQuery: (q: string) => void;
  results: TMDBPerson[];
  loading: boolean;
  showSuggestions: boolean;
  setShowSuggestions: (v: boolean) => void;
  selected: SelectedPerson | null;
  noResults: boolean;
  onSearch: (q: string) => void;
  onSelect: (person: TMDBPerson) => void;
  onClear: () => void;
}

export default function PersonSearchInput({
  label,
  placeholder,
  query,
  setQuery,
  results,
  loading,
  showSuggestions,
  setShowSuggestions,
  selected,
  noResults,
  onSearch,
  onSelect,
  onClear,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowSuggestions]);

  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearch(value);
      }, 300);
    },
    [setQuery, onSearch]
  );

  if (selected) {
    return (
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
        </label>
        <div className="flex items-center gap-2 rounded-lg bg-surface-light px-3 py-2.5 border border-border">
          <span className="inline-flex items-center gap-2 rounded-md bg-accent/15 px-3 py-1 text-sm font-medium text-accent">
            {selected.name}
            <button
              type="button"
              onClick={onClear}
              className="text-accent/60 hover:text-white transition-colors"
              aria-label="선택 해제"
            >
              ✕
            </button>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            if (results.length > 0 || noResults) setShowSuggestions(true);
          }}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-surface-light px-3 py-2.5 text-sm text-white placeholder-dim focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/40 transition-all"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-accent" />
          </div>
        )}
      </div>
      {showSuggestions && (
        <PersonSuggestionList
          results={results}
          onSelect={onSelect}
          noResults={noResults}
        />
      )}
    </div>
  );
}
