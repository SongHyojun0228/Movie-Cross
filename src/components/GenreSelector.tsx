"use client";

import { TMDBGenre } from "@/lib/types";

interface Props {
  genres: TMDBGenre[];
  loading: boolean;
  selectedGenreId: number | null;
  onSelect: (genreId: number | null) => void;
}

export default function GenreSelector({
  genres,
  loading,
  selectedGenreId,
  onSelect,
}: Props) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
        장르
      </label>
      <select
        value={selectedGenreId ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          onSelect(val ? Number(val) : null);
        }}
        disabled={loading}
        className="w-full rounded-lg border border-border bg-surface-light px-3 py-2.5 text-sm text-white focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/40 transition-all disabled:opacity-40 appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23808080' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
        }}
      >
        <option value="">장르 선택 (선택사항)</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
}
