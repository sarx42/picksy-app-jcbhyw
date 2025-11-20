
export type ViewerType = 'solo' | 'partner' | 'friends' | 'family';

export interface Movie {
  id: number;
  title: string;
  year: number | null;
  genres: string[];
  posterUrl: string | null;
  synopsis: string;
  imdbRating: number | null;
  rottenTomatoesScore: number | null;
  redditScore: number | null;
  runtimeMinutes: number | null;
}

export interface DiscoverFilters {
  genres: string[];
  yearFrom: number | null;
  yearTo: number | null;
  language: string;
  page: number;
}
