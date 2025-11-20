
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie } from '@/types/Movie';

const SAVED_MOVIES_KEY = '@picksy_saved_movies';
const WATCHED_MOVIES_KEY = '@picksy_watched_movies';
const SETTINGS_KEY = '@picksy_settings';

export interface AppSettings {
  defaultViewerType: string;
  defaultLanguage: string;
}

export async function getSavedMovies(): Promise<Movie[]> {
  try {
    const data = await AsyncStorage.getItem(SAVED_MOVIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading saved movies:', error);
    return [];
  }
}

export async function saveMovie(movie: Movie): Promise<void> {
  try {
    const movies = await getSavedMovies();
    const exists = movies.some(m => m.id === movie.id);
    if (!exists) {
      movies.push(movie);
      await AsyncStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(movies));
      console.log('Movie saved:', movie.title);
    }
  } catch (error) {
    console.error('Error saving movie:', error);
  }
}

export async function removeMovie(movieId: number): Promise<void> {
  try {
    const movies = await getSavedMovies();
    const filtered = movies.filter(m => m.id !== movieId);
    await AsyncStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(filtered));
    console.log('Movie removed:', movieId);
  } catch (error) {
    console.error('Error removing movie:', error);
  }
}

export async function getWatchedMovies(): Promise<number[]> {
  try {
    const data = await AsyncStorage.getItem(WATCHED_MOVIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading watched movies:', error);
    return [];
  }
}

export async function markAsWatched(movieId: number): Promise<void> {
  try {
    const watched = await getWatchedMovies();
    if (!watched.includes(movieId)) {
      watched.push(movieId);
      await AsyncStorage.setItem(WATCHED_MOVIES_KEY, JSON.stringify(watched));
      console.log('Movie marked as watched:', movieId);
    }
  } catch (error) {
    console.error('Error marking movie as watched:', error);
  }
}

export async function getSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : {
      defaultViewerType: 'solo',
      defaultLanguage: 'en-US',
    };
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      defaultViewerType: 'solo',
      defaultLanguage: 'en-US',
    };
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    console.log('Settings saved:', settings);
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}
