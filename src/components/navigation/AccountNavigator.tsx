import AboutScreen from 'components/AboutScreen';
import { AccountNavigatorParamList } from 'types/navigation';
import AccountScreen from 'components/AccountScreen';
import AppSettingsScreen from 'components/AppSettingsScreen';
import ContentScreen from 'components/ContentScreen';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'theme';

const AccountStack = createNativeStackNavigator<AccountNavigatorParamList>();

const AccountNavigator = () => {
  const theme = useTheme();

  return (
    <AccountStack.Navigator
      initialRouteName="Account"
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
      <AccountStack.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: 'Account',
          headerLeft: () => null,
          headerLargeTitle: true,
        }}
      />
      <AccountStack.Screen
        name="AppSettings"
        component={AppSettingsScreen}
        options={{
          title: 'App Settings',
          headerLargeTitle: true,
        }}
      />
      <AccountStack.Screen
        name="Content"
        component={ContentScreen}
        options={{
          title: '',
          headerLargeTitle: true,
        }}
      />
      <AccountStack.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'About',
          headerLargeTitle: true,
        }}
      />
    </AccountStack.Navigator>
  );
};

export default AccountNavigator;
