
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { Movie, ViewerType } from '@/types/Movie';
import { discoverMovies } from '@/utils/tmdb';
import { saveMovie } from '@/utils/storage';
import { getSnackSuggestion } from '@/utils/snackSuggestions';
import SnackToast from '@/components/SnackToast';

export default function MovieResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [snackSuggestion, setSnackSuggestion] = useState({ emoji: '', title: '', subtitle: '' });
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);

  const viewerType = (params.viewerType as ViewerType) || 'solo';
  const genres = params.genres ? JSON.parse(params.genres as string) : [];
  
  // Fix: Handle empty strings properly
  const yearFromParam = params.yearFrom as string;
  const yearToParam = params.yearTo as string;
  const yearFrom = yearFromParam && yearFromParam !== '' ? parseInt(yearFromParam) : null;
  const yearTo = yearToParam && yearToParam !== '' ? parseInt(yearToParam) : null;

  const currentMovie = movies[currentIndex];

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    console.log('Fetching movies with filters:', { genres, yearFrom, yearTo });
    try {
      const results = await discoverMovies({
        genres,
        yearFrom,
        yearTo,
        language: 'en-US',
        page: 1,
      });
      console.log('Fetched movies:', results.length);
      if (results.length > 0) {
        console.log('First movie:', results[0].title);
      }
      setMovies(results);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextMovie = () => {
    if (currentIndex < movies.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSynopsisExpanded(false);
    } else {
      console.log('No more movies in the list');
    }
  };

  const handleSaveToPicks = async () => {
    if (currentMovie) {
      await saveMovie(currentMovie);
      console.log('Movie saved to picks:', currentMovie.title);
    }
  };

  const handlePlayThisOne = () => {
    if (currentMovie) {
      const suggestion = getSnackSuggestion(viewerType, currentMovie.genres);
      setSnackSuggestion(suggestion);
      setToastVisible(true);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Movie Result',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Finding the perfect movie...</Text>
            </View>
          ) : movies.length > 0 && currentMovie ? (
            <View style={styles.movieContainer}>
              {currentMovie.posterUrl ? (
                <Image
                  source={{ uri: currentMovie.posterUrl }}
                  style={styles.poster}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.poster, styles.posterPlaceholder]}>
                  <Text style={styles.posterPlaceholderText}>🎬</Text>
                </View>
              )}

              <View style={styles.info}>
                <Text style={styles.title}>{currentMovie.title}</Text>
                {currentMovie.year && <Text style={styles.year}>{currentMovie.year}</Text>}

                <View style={styles.genreContainer}>
                  {currentMovie.genres.slice(0, 3).map((genre, index) => (
                    <View key={index} style={styles.genreChip}>
                      <Text style={styles.genreText}>{genre}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.ratingsRow}>
                  <View style={styles.rating}>
                    <Text style={styles.ratingLabel}>IMDb</Text>
                    <Text style={styles.ratingValue}>
                      {currentMovie.imdbRating ? `${Math.round(currentMovie.imdbRating * 10)}%` : '–'}
                    </Text>
                  </View>
                  <View style={styles.rating}>
                    <Text style={styles.ratingLabel}>🍅</Text>
                    <Text style={styles.ratingValue}>
                      {currentMovie.rottenTomatoesScore ? `${currentMovie.rottenTomatoesScore}%` : '–'}
                    </Text>
                  </View>
                  <View style={styles.rating}>
                    <Text style={styles.ratingLabel}>Reddit</Text>
                    <Text style={styles.ratingValue}>
                      {currentMovie.redditScore ? `${currentMovie.redditScore}%` : '–'}
                    </Text>
                  </View>
                </View>

                <View style={styles.synopsisContainer}>
                  <Text style={styles.synopsisLabel}>Storyline</Text>
                  <Text
                    style={styles.synopsis}
                    numberOfLines={synopsisExpanded ? undefined : 4}
                  >
                    {currentMovie.synopsis}
                  </Text>
                  {currentMovie.synopsis.length > 150 && (
                    <TouchableOpacity onPress={() => setSynopsisExpanded(!synopsisExpanded)}>
                      <Text style={styles.readMore}>
                        {synopsisExpanded ? 'Show less' : 'Read more'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[buttonStyles.primary, styles.button]}
                  onPress={handlePlayThisOne}
                >
                  <Text style={buttonStyles.primaryText}>Play this one</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[buttonStyles.secondary, styles.button]}
                  onPress={handleNextMovie}
                  disabled={currentIndex >= movies.length - 1}
                >
                  <Text style={[
                    buttonStyles.secondaryText,
                    currentIndex >= movies.length - 1 && styles.disabledText
                  ]}>
                    Next movie
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[buttonStyles.tertiary, styles.button]}
                  onPress={handleSaveToPicks}
                >
                  <Text style={buttonStyles.tertiaryText}>Save to Picks</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.movieCounter}>
                Movie {currentIndex + 1} of {movies.length}
              </Text>
            </View>
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsEmoji}>🎬</Text>
              <Text style={styles.noResultsText}>
                No matches yet. Try different genres or a different time period.
              </Text>
              <TouchableOpacity
                style={[buttonStyles.primary, styles.backButton]}
                onPress={() => router.back()}
              >
                <Text style={buttonStyles.primaryText}>Back to Discover</Text>
              </TouchableOpacity>
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
    </>
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
    paddingTop: Platform.OS === 'android' ? 20 : 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  movieContainer: {
    flex: 1,
  },
  poster: {
    width: '100%',
    height: 450,
    borderRadius: 16,
    backgroundColor: colors.highlight,
    marginBottom: 20,
  },
  posterPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterPlaceholderText: {
    fontSize: 64,
  },
  info: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  year: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  genreChip: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondary,
  },
  ratingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 18,
    backgroundColor: colors.highlight,
    borderRadius: 12,
  },
  rating: {
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  ratingValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  synopsisContainer: {
    marginTop: 8,
  },
  synopsisLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  synopsis: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  readMore: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    width: '100%',
  },
  disabledText: {
    opacity: 0.5,
  },
  movieCounter: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
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
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 32,
  },
});
