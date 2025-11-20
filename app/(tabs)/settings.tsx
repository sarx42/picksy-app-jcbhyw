
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { getSettings, saveSettings, AppSettings } from '@/utils/storage';

const VIEWER_TYPES = [
  { label: 'Solo', value: 'solo' },
  { label: 'Date night', value: 'partner' },
  { label: 'Friends', value: 'friends' },
  { label: 'Family', value: 'family' },
];

const LANGUAGES = [
  { label: 'English', value: 'en-US' },
  { label: 'Spanish', value: 'es-ES' },
  { label: 'French', value: 'fr-FR' },
  { label: 'German', value: 'de-DE' },
  { label: 'Italian', value: 'it-IT' },
];

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>({
    defaultViewerType: 'solo',
    defaultLanguage: 'en-US',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const loadedSettings = await getSettings();
    setSettings(loadedSettings);
  };

  const updateSetting = async (key: keyof AppSettings, value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Default viewer type</Text>
          <View style={styles.optionList}>
            {VIEWER_TYPES.map(type => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.option,
                  settings.defaultViewerType === type.value && styles.optionSelected,
                ]}
                onPress={() => updateSetting('defaultViewerType', type.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    settings.defaultViewerType === type.value && styles.optionTextSelected,
                  ]}
                >
                  {type.label}
                </Text>
                {settings.defaultViewerType === type.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Default language</Text>
          <View style={styles.optionList}>
            {LANGUAGES.map(lang => (
              <TouchableOpacity
                key={lang.value}
                style={[
                  styles.option,
                  settings.defaultLanguage === lang.value && styles.optionSelected,
                ]}
                onPress={() => updateSetting('defaultLanguage', lang.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    settings.defaultLanguage === lang.value && styles.optionTextSelected,
                  ]}
                >
                  {lang.label}
                </Text>
                {settings.defaultLanguage === lang.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About Picksy</Text>
          <Text style={styles.aboutText}>
            Picksy is your tiny movie night assistant. It serves one great movie at a time so you
            don&apos;t scroll forever. 🎬
          </Text>
          <Text style={styles.aboutText}>
            Powered by The Movie Database (TMDB) API.
          </Text>
        </View>
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
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  optionList: {
    gap: 8,
  },
  option: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  optionText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.text,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 20,
    color: colors.primary,
  },
  aboutSection: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 12,
    marginTop: 16,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 12,
  },
});
