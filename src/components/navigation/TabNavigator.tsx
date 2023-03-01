import { Platform, StatusBar, Text } from 'react-native';
import React, { useEffect } from 'react';

import MoreNavigator from './MoreNavigator';
import HomeNavigator from './HomeNavigator';
import { Icon } from '@rneui/base';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { TabNavigatorParamList } from 'types/navigation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'theme';
import ServicesNavigator from './ServicesNavigator';
import GivingNavigator from './GivingNavigator';

const Tab = createBottomTabNavigator<TabNavigatorParamList>();

const TabNavigator = () => {
  const theme = useTheme();

  useEffect(() => {
    StatusBar.setBarStyle(
      theme.mode === 'light' ? 'dark-content' : 'light-content',
    );

    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(theme.colors.white);
      SystemNavigationBar.setNavigationColor(
        theme.colors.hintGray,
        theme.mode === 'light' ? 'dark' : 'light',
        'navigation',
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.mode]);

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.brandPrimary,
        tabBarInactiveTintColor: theme.colors.lightGray,
        tabBarActiveBackgroundColor: theme.colors.activeTabBackground,
        tabBarInactiveBackgroundColor: theme.colors.inactiveTabBackground,
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarLabel: ({ focused }) => (
          <Text
            style={[
              theme.styles.textTiny,
              focused
                ? { color: theme.colors.brandPrimary }
                : { color: theme.colors.lightGray },
            ]}>
            {''}
          </Text>
        ),
        tabBarStyle: {
          backgroundColor: theme.colors.inactiveTabBackground,
          borderTopColor: theme.colors.tabBarBorder,
        },
        tabBarHideOnKeyboard: true,
        tabBarIconStyle: { top: 3 },
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Home',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color }) => (
            <Icon
              name={'home-circle'}
              type={'material-community'}
              color={color}
              size={28}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ServicesTab"
        component={ServicesNavigator}
        options={{
          tabBarLabel: 'Services',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color }) => (
            <Icon
              name={'television-play'}
              type={'material-community'}
              color={color}
              size={28}
            />
          ),
        }}
      />
      <Tab.Screen
        name="GivingTab"
        component={GivingNavigator}
        options={{
          tabBarLabel: 'Giving',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color }) => (
            <Icon
              name={'heart-circle'}
              type={'material-community'}
              color={color}
              size={28}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MoreTab"
        component={MoreNavigator}
        options={{
          tabBarLabel: 'More',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color }) => (
            <Icon
              name={'microsoft-xbox-controller-menu'}
              type={'material-community'}
              color={color}
              size={28}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
