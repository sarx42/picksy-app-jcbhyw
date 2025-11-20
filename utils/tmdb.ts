
import { Movie } from '@/types/Movie';
import { FALLBACK_MOVIES } from './fallbackMovies';
import { API_CONFIG } from '@/config';

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

export async function discoverMovies(params: DiscoverParams): Promise<Movie[]> {
  console.log('=== DISCOVER MOVIES START ===');
  console.log('Params:', JSON.stringify(params, null, 2));
  
  // If no API key, use fallback immediately
  if (!API_CONFIG.TMDB_API_KEY) {
    console.log('No TMDB_API_KEY found, using fallback movies');
    return filterFallbackMovies(params);
  }

  const genreIds = params.genres
    .map(genre => GENRE_MAP[genre])
    .filter(id => id !== undefined)
    .join(',');

  console.log('Genre IDs:', genreIds);

  const url = new URL(`${TMDB_BASE_URL}/discover/movie`);
  url.searchParams.append('api_key', API_CONFIG.TMDB_API_KEY);
  url.searchParams.append('include_adult', 'false');
  url.searchParams.append('language', params.language);
  url.searchParams.append('sort_by', 'popularity.desc');
  url.searchParams.append('page', params.page.toString());
  url.searchParams.append('vote_count.gte', '100');
  
  if (genreIds) {
    url.searchParams.append('with_genres', genreIds);
  }
  
  if (params.yearFrom !== null && !isNaN(params.yearFrom)) {
    url.searchParams.append('primary_release_date.gte', `${params.yearFrom}-01-01`);
    console.log('Year from:', params.yearFrom);
  }
  
  if (params.yearTo !== null && !isNaN(params.yearTo)) {
    url.searchParams.append('primary_release_date.lte', `${params.yearTo}-12-31`);
    console.log('Year to:', params.yearTo);
  }

  try {
    console.log('Fetching from TMDB URL:', url.toString());
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.log('TMDB fetch failed with status:', response.status, response.statusText);
      return filterFallbackMovies(params);
    }
    
    const data = await response.json();
    console.log('TMDB response received:', data.results?.length || 0, 'movies');
    
    if (!data.results || data.results.length === 0) {
      console.log('TMDB returned empty results, using fallback');
      return filterFallbackMovies(params);
    }

    const movies: Movie[] = data.results.map((movie: TMDBMovie) => {
      const movieGenres = movie.genre_ids.map(id => {
        const genreName = Object.keys(GENRE_MAP).find(key => GENRE_MAP[key] === id);
        return genreName || 'Unknown';
      }).filter(g => g !== 'Unknown');

      return {
        id: movie.id,
        title: movie.title,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
        genres: movieGenres,
        posterUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
        synopsis: movie.overview || 'No synopsis available.',
        imdbRating: null,
        rottenTomatoesScore: null,
        redditScore: null,
        runtimeMinutes: movie.runtime || null,
      };
    });

    console.log('Mapped', movies.length, 'movies from TMDB');
    console.log('First movie:', movies[0]?.title);
    console.log('=== DISCOVER MOVIES END ===');
    return movies;
  } catch (error) {
    console.log('TMDB fetch error:', error);
    return filterFallbackMovies(params);
  }
}

/**
 * Filter fallback movies based on the provided parameters
 */
function filterFallbackMovies(params: DiscoverParams): Movie[] {
  console.log('=== FILTERING FALLBACK MOVIES ===');
  console.log('Filter params:', JSON.stringify(params, null, 2));
  
  let filtered = [...FALLBACK_MOVIES];
  console.log('Starting with', filtered.length, 'fallback movies');

  // Filter by genres if specified
  if (params.genres.length > 0) {
    filtered = filtered.filter(movie =>
      params.genres.some(genre => movie.genres.includes(genre))
    );
    console.log('After genre filter:', filtered.length, 'movies');
  }

  // Filter by year range if specified
  if (params.yearFrom !== null && !isNaN(params.yearFrom) && params.yearTo !== null && !isNaN(params.yearTo)) {
    filtered = filtered.filter(movie =>
      movie.year !== null && movie.year >= params.yearFrom! && movie.year <= params.yearTo!
    );
    console.log('After year range filter:', filtered.length, 'movies');
  } else if (params.yearFrom !== null && !isNaN(params.yearFrom)) {
    filtered = filtered.filter(movie =>
      movie.year !== null && movie.year >= params.yearFrom!
    );
    console.log('After yearFrom filter:', filtered.length, 'movies');
  } else if (params.yearTo !== null && !isNaN(params.yearTo)) {
    filtered = filtered.filter(movie =>
      movie.year !== null && movie.year <= params.yearTo!
    );
    console.log('After yearTo filter:', filtered.length, 'movies');
  }

  // If filters are too restrictive and we have no results, return all fallback movies
  if (filtered.length === 0) {
    console.log('Filters too restrictive, returning all fallback movies');
    filtered = FALLBACK_MOVIES;
  }

  console.log('Final filtered count:', filtered.length);
  if (filtered.length > 0) {
    console.log('First filtered movie:', filtered[0].title);
  }
  console.log('=== FILTERING FALLBACK MOVIES END ===');
  
  return filtered;
}
