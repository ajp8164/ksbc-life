import { HomeNavigatorParamList } from 'types/navigation';
import HomeScreen from 'components/HomeScreen';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'theme';

const POSStack = createNativeStackNavigator<HomeNavigatorParamList>();

const HomeNavigator = () => {
  const theme = useTheme();

  return (
    <POSStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.screenHeaderBackground,
        },
        headerTitleStyle: {
          color: theme.colors.screenHeaderText,
        },
        headerTintColor: theme.colors.screenHeaderBackButton,
      }}>
      <POSStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: 'hello',
          headerLargeTitle: true,
        }}
      />
    </POSStack.Navigator>
  );
};

export default HomeNavigator;
