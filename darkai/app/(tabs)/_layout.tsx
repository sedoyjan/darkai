import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors, GradientColors } from '@/constants/Colors';

export const unstable_settings = {
  initialRouteName: 'test',
};

export default function TabLayout() {
  const { t } = useTranslation();
  return (
    <>
      <StatusBar style="light" />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primaryText,
          tabBarInactiveTintColor: Colors.primaryText,

          tabBarStyle: {
            backgroundColor: GradientColors[1],
            borderTopWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="(tasks)"
          options={{
            title: t('layout.tabs.tasks'),
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name={focused ? 'home' : 'home-outline'}
                color={Colors.primaryText}
              />
            ),
            tabBarItemStyle: {
              paddingBottom: 4,
            },
          }}
        />
        <Tabs.Screen
          name="(calendar)"
          options={{
            // tabBarButton: () => null,
            title: t('layout.tabs.calendar'),
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name={focused ? 'calendar' : 'calendar-outline'}
                color={Colors.primaryText}
              />
            ),
            tabBarItemStyle: {
              paddingBottom: 4,
            },
          }}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            title: t('layout.tabs.profile'),
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name={focused ? 'person' : 'person-outline'}
                color={Colors.primaryText}
              />
            ),
            tabBarItemStyle: {
              paddingBottom: 4,
            },
          }}
        />
      </Tabs>
    </>
  );
}
