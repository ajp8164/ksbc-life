import { HomeNavigatorParamList } from 'types/navigation';
import HomeScreen from 'components/HomeScreen';
import React from 'react';
import { SvgXml } from 'react-native-svg';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getSvg } from '@react-native-ajp-elements/ui';
import { useTheme } from 'theme';

const HomeStack = createNativeStackNavigator<HomeNavigatorParamList>();

const HomeNavigator = () => {
  const theme = useTheme();

  return (
    <HomeStack.Navigator
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
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShadowVisible: false,
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
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;
