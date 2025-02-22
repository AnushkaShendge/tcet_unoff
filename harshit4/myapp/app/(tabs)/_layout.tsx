import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Record',
          tabBarIcon: ({ color }) => <Feather name="mic" size={24} color={color} />, // Mic icon for recording
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Feather name="bar-chart-2" size={24} color={color} />, // Bar chart icon for dashboard
        }}
      />
      <Tabs.Screen
        name="multiagent"
        options={{
          title: 'Multi Agent',
          tabBarIcon: ({ color }) => <Feather name="users" size={24} color={color} />, // Users icon for multi-agent interactions
        }}
      />
      <Tabs.Screen
        name="agentlearningdashboard"
        options={{
          title: 'Agent Learning',
          tabBarIcon: ({ color }) => <Feather name="book-open" size={24} color={color} />, // Book icon for learning
        }}
      />
    </Tabs>
  );
}
