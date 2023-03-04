import AdminHomeScreen from 'components/admin/AdminHomeScreen';
import { AdminNavigatorParamList } from 'types/navigation';
import AdminSermonScreen from 'components/admin/AdminSermonScreen';
import AdminSermonsScreen from 'components/admin/AdminSermonsScreen';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'theme';

const AdminStack = createNativeStackNavigator<AdminNavigatorParamList>();

const AdminNavigator = () => {
  const theme = useTheme();

  return (
    <AdminStack.Navigator
      initialRouteName="AdminHome"
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
      <AdminStack.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{
          title: 'Administration',
          headerLeft: () => null,
          headerLargeTitle: true,
        }}
      />
      <AdminStack.Screen
        name="AdminSermons"
        component={AdminSermonsScreen}
        options={{
          title: 'Sermons',
          headerLeft: () => null,
          headerLargeTitle: true,
        }}
      />
      <AdminStack.Screen
        name="AdminSermon"
        component={AdminSermonScreen}
        options={{
          title: 'Sermon',
          headerLeft: () => null,
          headerLargeTitle: true,
        }}
      />
    </AdminStack.Navigator>
  );
};

export default AdminNavigator;
