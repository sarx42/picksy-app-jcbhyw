
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { ViewerType } from '@/types/Movie';
import FilterChip from '@/components/FilterChip';

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
  const router = useRouter();
  const [viewerType, setViewerType] = useState<ViewerType>('solo');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [timePeriod, setTimePeriod] = useState(TIME_PERIODS[0]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleFindMovie = () => {
    console.log('Navigating to MovieResultScreen with filters:', {
      viewerType,
      genres: selectedGenres,
      yearFrom: timePeriod.yearFrom,
      yearTo: timePeriod.yearTo,
    });
    router.push({
      pathname: '/movie-result',
      params: {
        viewerType,
        genres: JSON.stringify(selectedGenres),
        yearFrom: timePeriod.yearFrom?.toString() || '',
        yearTo: timePeriod.yearTo?.toString() || '',
      },
    });
  };

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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalChipContainer}
          >
            {VIEWER_TYPES.map(type => (
              <FilterChip
                key={type.value}
                label={type.label}
                selected={viewerType === type.value}
                onPress={() => setViewerType(type.value)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Pick your vibe</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalChipContainer}
          >
            {GENRES.map(genre => (
              <FilterChip
                key={genre}
                label={genre}
                selected={selectedGenres.includes(genre)}
                onPress={() => handleGenreToggle(genre)}
                multiSelect
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Pick a time period</Text>
          <View style={styles.gridChipContainer}>
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

        <TouchableOpacity
          style={[buttonStyles.primary, styles.findMovieButton]}
          onPress={handleFindMovie}
        >
          <Text style={buttonStyles.primaryText}>Find a movie</Text>
        </TouchableOpacity>
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
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  filterSection: {
    marginBottom: 32,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  horizontalChipContainer: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  gridChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  findMovieButton: {
    width: '100%',
    marginTop: 8,
    paddingVertical: 18,
    borderRadius: 30,
  },
});
