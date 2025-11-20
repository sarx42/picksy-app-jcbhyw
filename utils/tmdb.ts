
import Constants from 'expo-constants';

const TMDB_API_KEY = Constants.expoConfig?.extra?.TMDB_API_KEY || process.env.TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const GENRE_MAP: { [key: string]: number } = {
  'Action': 28,
  'Comedy': 35,
  'Romance': 10749,
  'Thriller': 53,
  'Horror': 27,
  'Drama': 18,
  'Sci-Fi': 878,
  'Animation': 16,
  'Mystery': 9648,
  'Documentary': 99,
  'Family': 10751,
};

interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  genre_ids: number[];
  poster_path: string | null;
  overview: string;
  vote_average: number;
  runtime?: number;
}

interface DiscoverParams {
  genres: string[];
  yearFrom: number | null;
  yearTo: number | null;
  language: string;
  page: number;
}

export async function discoverMovies(params: DiscoverParams): Promise<any[]> {
  console.log('Discovering movies with params:', params);
  
  if (!TMDB_API_KEY) {
    console.error('TMDB_API_KEY is not set');
    return [];
  }

  const genreIds = params.genres
    .map(genre => GENRE_MAP[genre])
    .filter(id => id !== undefined)
    .join(',');

  const url = new URL(`${TMDB_BASE_URL}/discover/movie`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  url.searchParams.append('language', params.language);
  url.searchParams.append('sort_by', 'popularity.desc');
  url.searchParams.append('page', params.page.toString());
  url.searchParams.append('vote_count.gte', '100');
  
  if (genreIds) {
    url.searchParams.append('with_genres', genreIds);
  }
  
  if (params.yearFrom) {
    url.searchParams.append('primary_release_date.gte', `${params.yearFrom}-01-01`);
  }
  
  if (params.yearTo) {
    url.searchParams.append('primary_release_date.lte', `${params.yearTo}-12-31`);
  }

  try {
    console.log('Fetching from TMDB:', url.toString());
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error('TMDB API error:', response.status, response.statusText);
      return [];
    }
    
    const data = await response.json();
    console.log('TMDB response:', data.results?.length, 'movies');
    
    return data.results.map((movie: TMDBMovie) => ({
      id: movie.id,
      title: movie.title,
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
      genres: movie.genre_ids.map(id => {
        const genreName = Object.keys(GENRE_MAP).find(key => GENRE_MAP[key] === id);
        return genreName || 'Unknown';
      }),
      posterUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
      synopsis: movie.overview || 'No synopsis available.',
      imdbRating: null,
      rottenTomatoesScore: null,
      redditScore: null,
      runtimeMinutes: movie.runtime || null,
    }));
  } catch (error) {
    console.error('Error fetching movies from TMDB:', error);
    return [];
  }
}
