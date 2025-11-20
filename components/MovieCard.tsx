
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { Movie } from '@/types/Movie';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);

  return (
    <View style={styles.card}>
      {movie.posterUrl ? (
        <Image source={{ uri: movie.posterUrl }} style={styles.poster} resizeMode="cover" />
      ) : (
        <View style={[styles.poster, styles.posterPlaceholder]}>
          <Text style={styles.posterPlaceholderText}>🎬</Text>
        </View>
      )}
      
      <View style={styles.info}>
        <Text style={styles.title}>{movie.title}</Text>
        {movie.year && <Text style={styles.year}>{movie.year}</Text>}
        
        <View style={styles.genreContainer}>
          {movie.genres.slice(0, 3).map((genre, index) => (
            <View key={index} style={styles.genreChip}>
              <Text style={styles.genreText}>{genre}</Text>
            </View>
          ))}
        </View>

        <View style={styles.ratingsRow}>
          <View style={styles.rating}>
            <Text style={styles.ratingLabel}>IMDb</Text>
            <Text style={styles.ratingValue}>
              {movie.imdbRating ? `${Math.round(movie.imdbRating * 10)}%` : '–'}
            </Text>
          </View>
          <View style={styles.rating}>
            <Text style={styles.ratingLabel}>🍅</Text>
            <Text style={styles.ratingValue}>
              {movie.rottenTomatoesScore ? `${movie.rottenTomatoesScore}%` : '–'}
            </Text>
          </View>
          <View style={styles.rating}>
            <Text style={styles.ratingLabel}>Reddit</Text>
            <Text style={styles.ratingValue}>
              {movie.redditScore ? `${movie.redditScore}%` : '–'}
            </Text>
          </View>
        </View>

        <View style={styles.synopsisContainer}>
          <Text style={styles.synopsisLabel}>Storyline</Text>
          <Text
            style={styles.synopsis}
            numberOfLines={synopsisExpanded ? undefined : 3}
          >
            {movie.synopsis}
          </Text>
          <TouchableOpacity onPress={() => setSynopsisExpanded(!synopsisExpanded)}>
            <Text style={styles.readMore}>
              {synopsisExpanded ? 'Show less' : 'Read more'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.4)',
    elevation: 6,
  },
  poster: {
    width: '100%',
    height: 400,
    backgroundColor: colors.highlight,
  },
  posterPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterPlaceholderText: {
    fontSize: 64,
  },
  info: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  year: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  genreChip: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
  },
  ratingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: colors.highlight,
    borderRadius: 12,
  },
  rating: {
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  synopsisContainer: {
    marginTop: 8,
  },
  synopsisLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  synopsis: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  readMore: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
