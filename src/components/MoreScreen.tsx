import {
  MoreNavigatorParamList,
  MainNavigatorParamList,
} from 'types/navigation';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'theme';
import { ListItem } from '@react-native-ajp-elements/ui';
import React from 'react';
import { CompositeScreenProps } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { appConfig } from 'config';

type Props = CompositeScreenProps<
  NativeStackScreenProps<MoreNavigatorParamList, 'More'>,
  NativeStackScreenProps<MainNavigatorParamList>
>;

const MoreScreen = ({ navigation }: Props) => {
  const theme = useTheme();

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

export default MoreScreen;
