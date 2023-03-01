import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'theme';
import { GivingNavigatorParamList } from 'types/navigation';
import GivingScreen from 'components/GivingScreen';

const GivingStack = createNativeStackNavigator<GivingNavigatorParamList>();

const GivingNavigator = () => {
  const theme = useTheme();

  return (
    <GivingStack.Navigator
      initialRouteName="Giving"
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
      <GivingStack.Screen
        name="Giving"
        component={GivingScreen}
        options={{
          title: 'Giving',
          headerLeft: () => null,
          headerLargeTitle: true,
        }}
      />
    </GivingStack.Navigator>
  );
};

export default GivingNavigator;
