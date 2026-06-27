import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ENDPOINTS = [
  /^search\/person$/,
  /^person\/\d+\/movie_credits$/,
  /^genre\/movie\/list$/,
  /^movie\/\d+$/,
  /^discover\/movie$/,
];

export async function GET(request: NextRequest) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "TMDB_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    return NextResponse.json(
      { error: "endpoint parameter is required" },
      { status: 400 }
    );
  }

  const isAllowed = ALLOWED_ENDPOINTS.some((pattern) => pattern.test(endpoint));
  if (!isAllowed) {
    return NextResponse.json(
      { error: "endpoint not allowed" },
      { status: 403 }
    );
  }

  // Forward all other query params to TMDB
  const tmdbParams = new URLSearchParams();
  tmdbParams.set("api_key", apiKey);

  searchParams.forEach((value, key) => {
    if (key !== "endpoint") {
      tmdbParams.set(key, value);
    }
  });

  // Default language to ko-KR if not specified
  if (!tmdbParams.has("language")) {
    tmdbParams.set("language", "ko-KR");
  }

  const tmdbUrl = `https://api.themoviedb.org/3/${endpoint}?${tmdbParams.toString()}`;

  try {
    const response = await fetch(tmdbUrl);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch from TMDB" },
      { status: 502 }
    );
  }
}
