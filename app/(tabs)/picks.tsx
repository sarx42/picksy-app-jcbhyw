
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { Movie } from '@/types/Movie';
import { getSavedMovies, removeMovie, markAsWatched, getWatchedMovies } from '@/utils/storage';
import { useFocusEffect } from '@react-navigation/native';

export default function PicksScreen() {
  const [savedMovies, setSavedMovies] = useState<Movie[]>([]);
  const [watchedIds, setWatchedIds] = useState<number[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadMovies();
    }, [])
  );

  const loadMovies = async () => {
    const movies = await getSavedMovies();
    const watched = await getWatchedMovies();
    setSavedMovies(movies);
    setWatchedIds(watched);
  };

  const handleMarkAsWatched = async (movieId: number) => {
    await markAsWatched(movieId);
    loadMovies();
  };

  const handleRemove = async (movieId: number) => {
    await removeMovie(movieId);
    loadMovies();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Your saved movies</Text>

        {savedMovies.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>❤️</Text>
            <Text style={styles.emptyText}>
              Nothing saved yet. Swipe right or tap Save to Picks.
            </Text>
          </View>
        ) : (
          <View style={styles.movieList}>
            {savedMovies.map((movie, index) => {
              const isWatched = watchedIds.includes(movie.id);
              return (
                <View key={index} style={styles.movieItem}>
                  <View style={styles.movieInfo}>
                    {movie.posterUrl ? (
                      <Image
                        source={{ uri: movie.posterUrl }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
                        <Text style={styles.thumbnailPlaceholderText}>🎬</Text>
                      </View>
                    )}
                    <View style={styles.movieDetails}>
                      <Text style={styles.movieTitle} numberOfLines={2}>
                        {movie.title}
                      </Text>
                      {movie.year && (
                        <Text style={styles.movieYear}>{movie.year}</Text>
                      )}
                      {movie.imdbRating && (
                        <Text style={styles.movieRating}>
                          ⭐ {Math.round(movie.imdbRating * 10)}%
                        </Text>
                      )}
                      {isWatched && (
                        <Text style={styles.watchedBadge}>✓ Watched</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.movieActions}>
                    {!isWatched && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleMarkAsWatched(movie.id)}
                      >
                        <Text style={styles.actionButtonText}>Mark as watched</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.actionButton, styles.removeButton]}
                      onPress={() => handleRemove(movie.id)}
                    >
                      <Text style={[styles.actionButtonText, styles.removeButtonText]}>
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  movieList: {
    gap: 16,
  },
  movieItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  movieInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  thumbnail: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: colors.highlight,
    marginRight: 16,
  },
  thumbnailPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailPlaceholderText: {
    fontSize: 32,
  },
  movieDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  movieYear: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  movieRating: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 4,
  },
  watchedBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },
  movieActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  removeButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  removeButtonText: {
    color: colors.accent,
  },
});
