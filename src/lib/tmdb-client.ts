export async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string> = {},
  signal?: AbortSignal
): Promise<T> {
  const searchParams = new URLSearchParams({ endpoint, ...params });

  const response = await fetch(`/api/tmdb?${searchParams.toString()}`, {
    signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `TMDB request failed: ${response.status}`);
  }

  return response.json();
}
