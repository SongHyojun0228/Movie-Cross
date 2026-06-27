"use client";

import { useState, useCallback, useRef } from "react";
import { TMDBPerson, TMDBPersonSearchResult, SelectedPerson } from "@/lib/types";
import { tmdbFetch } from "@/lib/tmdb-client";

export function usePersonSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selected, setSelected] = useState<SelectedPerson | null>(null);
  const [noResults, setNoResults] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setResults([]);
      setShowSuggestions(false);
      setNoResults(false);
      return;
    }

    // Abort previous search
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setNoResults(false);

    try {
      const data = await tmdbFetch<TMDBPersonSearchResult>(
        "search/person",
        { query: trimmed },
        controller.signal
      );

      if (!controller.signal.aborted) {
        const sorted = data.results.sort(
          (a, b) => b.popularity - a.popularity
        );
        setResults(sorted);
        setShowSuggestions(sorted.length > 0);
        setNoResults(sorted.length === 0);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Person search failed:", err);
        setResults([]);
        setShowSuggestions(false);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  const selectPerson = useCallback((person: TMDBPerson) => {
    setSelected({ id: person.id, name: person.name });
    setQuery(person.name);
    setShowSuggestions(false);
    setResults([]);
    setNoResults(false);
  }, []);

  const clear = useCallback(() => {
    setSelected(null);
    setQuery("");
    setResults([]);
    setShowSuggestions(false);
    setNoResults(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    showSuggestions,
    setShowSuggestions,
    selected,
    noResults,
    search,
    selectPerson,
    clear,
  };
}
