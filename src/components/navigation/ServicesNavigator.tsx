import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'theme';
import { ServicesNavigatorParamList } from 'types/navigation';
import ServicesScreen from 'components/ServicesScreen';

const ServicesStack = createNativeStackNavigator<ServicesNavigatorParamList>();

const ServicesNavigator = () => {
  const theme = useTheme();

  return (
    <ServicesStack.Navigator
      initialRouteName="Services"
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
      <ServicesStack.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          title: 'Services',
          headerLeft: () => null,
          headerLargeTitle: true,
        }}
      />
    </ServicesStack.Navigator>
  );
};

export default ServicesNavigator;
