export default function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClass = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-10 w-10 border-[3px]",
  }[size];

  return (
    <div className="flex justify-center py-4">
      <div
        className={`${sizeClass} animate-spin rounded-full border-border border-t-accent`}
      />
    </div>
  );
}
