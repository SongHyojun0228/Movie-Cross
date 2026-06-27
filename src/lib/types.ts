// TMDB API 응답 타입

export interface TMDBPerson {
  id: number;
  name: string;
  known_for_department: string;
  popularity: number;
  profile_path: string | null;
}

export interface TMDBPersonSearchResult {
  page: number;
  results: TMDBPerson[];
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBGenreListResult {
  genres: TMDBGenre[];
}

export interface TMDBMovieSummary {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  genre_ids: number[];
  vote_average: number;
  popularity: number;
}

export interface TMDBCrewCredit {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string | null;
  genre_ids: number[];
  vote_average: number;
  popularity: number;
  job: string;
  department: string;
}

export interface TMDBCastCredit {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string | null;
  genre_ids: number[];
  vote_average: number;
  popularity: number;
  character: string;
  order: number;
}

export interface TMDBPersonMovieCredits {
  id: number;
  cast: TMDBCastCredit[];
  crew: TMDBCrewCredit[];
}

export interface TMDBVideo {
  key: string;
  site: string;
  type: string;
  name: string;
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  order: number;
}

export interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

export interface TMDBMovieDetail {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  genres: TMDBGenre[];
  vote_average: number;
  runtime: number | null;
  videos?: { results: TMDBVideo[] };
  credits?: {
    cast: TMDBCastMember[];
    crew: TMDBCrewMember[];
  };
}

export interface TMDBDiscoverResult {
  page: number;
  results: TMDBMovieSummary[];
  total_results: number;
  total_pages: number;
}

// 앱 내부 타입

export interface SelectedPerson {
  id: number;
  name: string;
}

export interface MovieInfo {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  posterPath: string | null;
  genres: TMDBGenre[];
  voteAverage: number;
  runtime: number | null;
  directors: string[];
  topCast: string[];
  trailerUrl: string | null;
}

export interface IntersectionResult {
  label: string;
  movies: MovieInfo[];
}

export interface SearchState {
  director: SelectedPerson | null;
  actor: SelectedPerson | null;
  genreId: number | null;
}
