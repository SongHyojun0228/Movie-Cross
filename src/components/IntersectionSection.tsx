import { IntersectionResult } from "@/lib/types";
import MovieCard from "./MovieCard";

interface Props {
  section: IntersectionResult;
}

export default function IntersectionSection({ section }: Props) {
  return (
    <div>
      {/* Section header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-6 w-1 rounded-full bg-accent" />
        <h3 className="text-lg font-bold text-white tracking-tight">
          {section.label}
        </h3>
        <span className="rounded bg-surface-light px-2 py-0.5 text-xs font-medium text-muted">
          {section.movies.length}편
        </span>
      </div>

      {section.movies.length === 0 ? (
        <div className="rounded-xl border border-border/50 bg-surface/50 px-4 py-12 text-center">
          <p className="text-sm text-dim">
            해당 교집합에 해당하는 영화가 없습니다
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {section.movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
