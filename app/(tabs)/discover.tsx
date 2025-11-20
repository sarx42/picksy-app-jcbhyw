
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { Movie, ViewerType } from '@/types/Movie';
import { discoverMovies } from '@/utils/tmdb';
import { saveMovie } from '@/utils/storage';
import { getSnackSuggestion } from '@/utils/snackSuggestions';
import MovieCard from '@/components/MovieCard';
import FilterChip from '@/components/FilterChip';
import SnackToast from '@/components/SnackToast';

const VIEWER_TYPES: { label: string; value: ViewerType }[] = [
  { label: 'Solo', value: 'solo' },
  { label: 'Date night', value: 'partner' },
  { label: 'Friends', value: 'friends' },
  { label: 'Family', value: 'family' },
];

const GENRES = [
  'Action',
  'Comedy',
  'Romance',
  'Thriller',
  'Horror',
  'Drama',
  'Sci-Fi',
  'Animation',
  'Mystery',
  'Documentary',
  'Family',
];

const TIME_PERIODS: { label: string; yearFrom: number | null; yearTo: number | null }[] = [
  { label: 'Any', yearFrom: null, yearTo: null },
  { label: 'Classics', yearFrom: 1950, yearTo: 1989 },
  { label: '90s', yearFrom: 1990, yearTo: 1999 },
  { label: '2000s', yearFrom: 2000, yearTo: 2009 },
  { label: '2010s', yearFrom: 2010, yearTo: 2019 },
  { label: 'Latest', yearFrom: 2020, yearTo: new Date().getFullYear() },
];

export default function DiscoverScreen() {
  const [viewerType, setViewerType] = useState<ViewerType>('solo');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [timePeriod, setTimePeriod] = useState(TIME_PERIODS[0]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [snackSuggestion, setSnackSuggestion] = useState({ emoji: '', title: '', subtitle: '' });

  const currentMovie = movies[currentIndex];

  useEffect(() => {
    fetchMovies();
  }, [selectedGenres, timePeriod]);

  const fetchMovies = async () => {
    setLoading(true);
    console.log('Fetching movies...');
    const results = await discoverMovies({
      genres: selectedGenres,
      yearFrom: timePeriod.yearFrom,
      yearTo: timePeriod.yearTo,
      language: 'en-US',
      page: 1,
    });
    console.log('Fetched movies:', results.length);
    setMovies(results);
    setCurrentIndex(0);
    setLoading(false);
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleShowAnother = () => {
    if (currentIndex < movies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      fetchMovies();
    }
  };

  const handleSaveToPicks = async () => {
    if (currentMovie) {
      await saveMovie(currentMovie);
      handleShowAnother();
    }
  };

  const handlePlayThisOne = () => {
    if (currentMovie) {
      const suggestion = getSnackSuggestion(viewerType, currentMovie.genres);
      setSnackSuggestion(suggestion);
      setToastVisible(true);
    }
  };

  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.translationX < -100) {
        handleShowAnother();
      } else if (event.translationX > 100) {
        handleSaveToPicks();
      }
    });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>What are we watching tonight?</Text>
          <Text style={styles.subtitle}>
            Picksy shows one movie at a time so you don&apos;t scroll forever.
          </Text>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Who is on the couch?</Text>
          <View style={styles.chipContainer}>
            {VIEWER_TYPES.map(type => (
              <FilterChip
                key={type.value}
                label={type.label}
                selected={viewerType === type.value}
                onPress={() => setViewerType(type.value)}
              />
            ))}
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Pick your vibe</Text>
          <View style={styles.chipContainer}>
            {GENRES.map(genre => (
              <FilterChip
                key={genre}
                label={genre}
                selected={selectedGenres.includes(genre)}
                onPress={() => handleGenreToggle(genre)}
              />
            ))}
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Pick a time period</Text>
          <View style={styles.chipContainer}>
            {TIME_PERIODS.map(period => (
              <FilterChip
                key={period.label}
                label={period.label}
                selected={timePeriod.label === period.label}
                onPress={() => setTimePeriod(period)}
              />
            ))}
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Finding the perfect movie...</Text>
          </View>
        ) : currentMovie ? (
          <GestureDetector gesture={swipeGesture}>
            <View>
              <MovieCard movie={currentMovie} />
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[buttonStyles.primary, styles.button]}
                  onPress={handlePlayThisOne}
                >
                  <Text style={buttonStyles.primaryText}>Play this one</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[buttonStyles.secondary, styles.button]}
                  onPress={handleShowAnother}
                >
                  <Text style={buttonStyles.secondaryText}>Show another</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[buttonStyles.tertiary, styles.button]}
                  onPress={handleSaveToPicks}
                >
                  <Text style={buttonStyles.tertiaryText}>Save to Picks</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.swipeHint}>
                💡 Swipe left to skip, swipe right to save
              </Text>
            </View>
          </GestureDetector>
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsEmoji}>🎬</Text>
            <Text style={styles.noResultsText}>
              No matches yet. Try different genres or a different time period.
            </Text>
          </View>
        )}
      </ScrollView>

      <SnackToast
        emoji={snackSuggestion.emoji}
        title={snackSuggestion.title}
        subtitle={snackSuggestion.subtitle}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  button: {
    width: '100%',
  },
  swipeHint: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
