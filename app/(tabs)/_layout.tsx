
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: 'discover',
      route: '/(tabs)/discover',
      icon: 'movie',
      label: 'Discover',
    },
    {
      name: 'picks',
      route: '/(tabs)/picks',
      icon: 'favorite',
      label: 'My Picks',
    },
    {
      name: 'settings',
      route: '/(tabs)/settings',
      icon: 'settings',
      label: 'Settings',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="discover" name="discover" />
        <Stack.Screen key="picks" name="picks" />
        <Stack.Screen key="settings" name="settings" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
