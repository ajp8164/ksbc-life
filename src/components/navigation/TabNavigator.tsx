import { Platform, StatusBar } from 'react-native';
import React, { useEffect } from 'react';

import ChatNavigator from './ChatNavigator';
import GivingNavigator from './GivingNavigator';
import HomeNavigator from './HomeNavigator';
import { Icon } from '@rneui/base';
import MoreNavigator from './MoreNavigator';
import SermonsNavigator from './SermonsNavigator';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { TabNavigatorParamList } from 'types/navigation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'theme';

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
        tabBarActiveTintColor: theme.colors.brandSecondary,
        tabBarInactiveTintColor: theme.colors.lightGray,
        tabBarActiveBackgroundColor: theme.colors.activeTabBackground,
        tabBarInactiveBackgroundColor: theme.colors.inactiveTabBackground,
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
        name="SermonsTab"
        component={SermonsNavigator}
        options={{
          tabBarLabel: 'Sermons',
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
        name="ChatTab"
        component={ChatNavigator}
        options={{
          tabBarLabel: 'Chat',
          tabBarHideOnKeyboard: false,
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color }) => (
            <Icon
              name={'chat'}
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
