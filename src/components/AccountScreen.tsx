import {
  AccountNavigatorParamList,
  MainNavigatorParamList,
} from 'types/navigation';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'theme';
import { ListItem } from '@react-native-ajp-elements/ui';
import React, { useEffect } from 'react';
import { CompositeScreenProps } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { appConfig } from 'config';

type Props = CompositeScreenProps<
  NativeStackScreenProps<AccountNavigatorParamList, 'Account'>,
  NativeStackScreenProps<MainNavigatorParamList>
>;

const AccountScreen = ({ route, navigation }: Props) => {
  const theme = useTheme();

  useEffect(() => {
    if (route.params?.subNav) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      navigation.navigate(route.params.subNav as any); // Could not discern type
      navigation.setParams({ subNav: undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.subNav]);

  return (
    <View>
      <ScrollView
        style={theme.styles.view}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <ListItem
          title={'App Settings'}
          position={['first']}
          onPress={() => navigation.navigate('AppSettings')}
        />
        <ListItem
          title={`About ${appConfig.appName}`}
          position={['last']}
          onPress={() => navigation.navigate('About')}
        />
      </ScrollView>
    </View>
  );
};

export default AccountScreen;
