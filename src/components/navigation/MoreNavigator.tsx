import AboutScreen from 'components/AboutScreen';
import { MoreNavigatorParamList } from 'types/navigation';
import MoreScreen from 'components/MoreScreen';
import AppSettingsScreen from 'components/AppSettingsScreen';
import ContentScreen from 'components/ContentScreen';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'theme';

const MoreStack = createNativeStackNavigator<MoreNavigatorParamList>();

const MoreNavigator = () => {
  const theme = useTheme();

  return (
    <MoreStack.Navigator
      initialRouteName="More"
      screenOptions={{
        headerLargeTitleShadowVisible: theme.mode === 'light',
        headerLargeStyle: {
          backgroundColor: theme.colors.screenHeaderBackground,
        },
        headerStyle: {
          backgroundColor: theme.colors.screenHeaderBackground,
        },
        headerTitleStyle: {
          color: theme.colors.screenHeaderText,
        },
        headerTintColor: theme.colors.screenHeaderBackButton,
      }}>
      <MoreStack.Screen
        name="More"
        component={MoreScreen}
        options={{
          title: 'More',
          headerLeft: () => null,
          headerLargeTitle: true,
        }}
      />
      <MoreStack.Screen
        name="AppSettings"
        component={AppSettingsScreen}
        options={{
          title: 'App Settings',
          headerLargeTitle: true,
        }}
      />
      <MoreStack.Screen
        name="Content"
        component={ContentScreen}
        options={{
          title: '',
          headerLargeTitle: true,
        }}
      />
      <MoreStack.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'About',
          headerLargeTitle: true,
        }}
      />
    </MoreStack.Navigator>
  );
};

export default MoreNavigator;
