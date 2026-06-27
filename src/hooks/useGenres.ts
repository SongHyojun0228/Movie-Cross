"use client";

import { useState, useEffect } from "react";
import { TMDBGenre, TMDBGenreListResult } from "@/lib/types";
import { tmdbFetch } from "@/lib/tmdb-client";

export function useGenres() {
  const [genres, setGenres] = useState<TMDBGenre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchGenres() {
      try {
        const data = await tmdbFetch<TMDBGenreListResult>("genre/movie/list");
        if (!cancelled) {
          setGenres(data.genres);
        }
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchGenres();
    return () => {
      cancelled = true;
    };
  }, []);

  return { genres, loading };
}
