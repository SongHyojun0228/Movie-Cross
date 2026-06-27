import { IntersectionResult } from "@/lib/types";
import IntersectionSection from "./IntersectionSection";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
  results: IntersectionResult[];
  loading: boolean;
  error: string | null;
}

export default function ResultsSection({ results, loading, error }: Props) {
  if (loading) {
    return (
      <div className="mt-12 flex flex-col items-center">
        <LoadingSpinner size="lg" />
        <p className="mt-3 text-sm text-muted">
          영화 정보를 가져오는 중...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-6 text-center text-sm text-red-400">
        {error}
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 space-y-10">
      {results.map((section) => (
        <IntersectionSection key={section.label} section={section} />
      ))}
    </div>
  );
}
