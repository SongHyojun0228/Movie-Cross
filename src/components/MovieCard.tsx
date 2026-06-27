import Image from "next/image";
import { MovieInfo } from "@/lib/types";

interface Props {
  movie: MovieInfo;
}

export default function MovieCard({ movie }: Props) {
  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  return (
    <div className="group relative flex-shrink-0">
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-surface-light">
        {movie.posterPath ? (
          <Image
            src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 185px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-dim">
            포스터 없음
          </div>
        )}

        {/* Rating badge */}
        {movie.voteAverage > 0 && (
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold backdrop-blur-sm">
            <span className="text-yellow-400">★</span>
            <span className="text-white">{movie.voteAverage.toFixed(1)}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="p-3 space-y-1.5">
            {movie.directors.length > 0 && (
              <p className="text-xs text-gray-300">
                <span className="text-muted">감독</span>{" "}
                {movie.directors.join(", ")}
              </p>
            )}
            {movie.topCast.length > 0 && (
              <p className="text-xs text-gray-300 line-clamp-2">
                <span className="text-muted">출연</span>{" "}
                {movie.topCast.join(", ")}
              </p>
            )}
            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {movie.genres.slice(0, 3).map((g) => (
                  <span
                    key={g.id}
                    className="rounded bg-white/15 px-1.5 py-0.5 text-[10px] text-gray-300 backdrop-blur-sm"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 pt-0.5">
              {movie.runtime && (
                <span className="text-[10px] text-muted">{movie.runtime}분</span>
              )}
              {movie.trailerUrl ? (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded bg-accent/90 px-2 py-0.5 text-[10px] font-semibold text-white transition-colors hover:bg-accent"
                >
                  ▶ 예고편
                </a>
              ) : (
                <span className="text-[10px] text-dim">예고편 없음</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Title below poster */}
      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-medium text-white leading-snug line-clamp-2">
          {movie.title}
        </h3>
        <div className="mt-0.5 flex items-center gap-1.5">
          {year && (
            <span className="text-xs text-muted">{year}</span>
          )}
          {movie.originalTitle !== movie.title && (
            <span className="text-xs text-dim truncate">{movie.originalTitle}</span>
          )}
        </div>
      </div>
    </div>
  );
}
