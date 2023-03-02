import React from 'react';
import SermonDetailScreen from 'components/SermonDetailScreen';
import { SermonsNavigatorParamList } from 'types/navigation';
import SermonsScreen from 'components/SermonsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'theme';

const SermonsStack = createNativeStackNavigator<SermonsNavigatorParamList>();

const SermonsNavigator = () => {
  const theme = useTheme();

  return (
    <SermonsStack.Navigator
      initialRouteName="Sermons"
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
      <SermonsStack.Screen
        name="Sermons"
        component={SermonsScreen}
        options={{
          title: 'Sermons',
          headerLeft: () => null,
          headerLargeTitle: true,
        }}
      />
      <SermonsStack.Screen
        name="SermonDetail"
        component={SermonDetailScreen}
        options={{
          title: '',
          headerLeft: () => null,
          headerLargeTitle: true,
        }}
      />
    </SermonsStack.Navigator>
  );
};

export default SermonsNavigator;
