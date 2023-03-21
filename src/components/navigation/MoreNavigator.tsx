import AboutScreen from 'components/AboutScreen';
import AdminChurchScreen from 'components/admin/AdminChurchScreen';
import AdminHomeScreen from 'components/admin/AdminHomeScreen';
import AdminPasteursScreen from 'components/admin/AdminPasteursScreen';
import AdminSermonsScreen from 'components/admin/AdminSermonsScreen';
import AdminUsersScreen from 'components/admin/AdminUsersScreen';
import AppSettingsScreen from 'components/AppSettingsScreen';
import ContentScreen from 'components/ContentScreen';
import { MoreNavigatorParamList } from 'types/navigation';
import MoreScreen from 'components/MoreScreen';
import React from 'react';
import UserProfileScreen from 'components/UserProfileScreen';
import { appConfig } from 'config';
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
        name="UserProfile"
        component={UserProfileScreen}
        options={{
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
          title: `About ${appConfig.appName}`,
          headerLargeTitle: true,
        }}
      />
      {/* Admin screens */}
      <MoreStack.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{
          title: 'Administration',
          headerLeft: () => null,
          headerLargeTitle: true,
        }}
      />
      <MoreStack.Screen
        name="AdminChurch"
        component={AdminChurchScreen}
        options={{
          title: 'Church',
          headerLeft: () => null,
          headerLargeTitle: true,
        }}
      />
      <MoreStack.Screen
        name="AdminPasteursList"
        component={AdminPasteursScreen}
        options={{
          title: 'Pasteurs',
          headerLeft: () => null,
          headerLargeTitle: true,
        }}
      />
      <MoreStack.Screen
        name="AdminSermonsList"
        component={AdminSermonsScreen}
        options={{
          title: 'Sermons',
          headerLeft: () => null,
          headerLargeTitle: true,
        }}
      />
      <MoreStack.Screen
        name="AdminUsersList"
        component={AdminUsersScreen}
        options={{
          title: 'Users',
          headerLeft: () => null,
          headerLargeTitle: true,
        }}
      />
    </MoreStack.Navigator>
  );
};

export default MoreNavigator;
