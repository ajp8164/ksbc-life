import { getSvg } from '@react-native-ajp-elements/ui';
import { SvgXml } from 'react-native-svg';
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
          // eslint-disable-next-line react/no-unstable-nested-components
          headerTitle: () => (
            <SvgXml
              width={45}
              height={45}
              style={{ top: -5 }}
              xml={getSvg('brandIcon')}
            />
          ),
        }}
      />
    </POSStack.Navigator>
  );
};

export default HomeNavigator;
