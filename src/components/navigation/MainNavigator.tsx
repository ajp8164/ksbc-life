import { MainNavigatorParamList, StartupScreen } from 'types/navigation';

import React from 'react';
import StartupNavigator from './StartupNavigator';
import TabNavigator from './TabNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const MainStack = createNativeStackNavigator<MainNavigatorParamList>();

interface MainNavigatorInterface {
  startupScreen: StartupScreen;
}

const MainNavigator = ({ startupScreen }: MainNavigatorInterface) => {
  // Wait for initialization to complete.
  if (startupScreen === StartupScreen.None) {
    return null;
  }

  return (
    <MainStack.Navigator
      initialRouteName={
        startupScreen === StartupScreen.Welcome ? 'Startup' : 'Tabs'
      }>
      <MainStack.Screen
        name="Startup"
        component={StartupNavigator}
        options={{
          headerShown: false,
          animation: 'none',
        }}
      />
      <MainStack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
