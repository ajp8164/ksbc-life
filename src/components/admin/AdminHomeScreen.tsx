import {
  AdminNavigatorParamList,
  TabNavigatorParamList,
} from 'types/navigation';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import React, { useEffect } from 'react';

import { Button } from '@rneui/base';
import { CompositeScreenProps } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { dispatch } from 'store';
import { saveAdminMode } from 'store/slices/appSettings';
import { useTheme } from 'theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<AdminNavigatorParamList, 'AdminHome'>,
  NativeStackScreenProps<TabNavigatorParamList>
>;

const AdminHomeScreen = ({ navigation }: Props) => {
  const theme = useTheme();

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <>
          <Button
            type={'clear'}
            title={'Exit Admin'}
            onPress={() => {
              dispatch(saveAdminMode({ value: false }));
              navigation.navigate('MoreTab');
            }}
          />
        </>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Divider />
        <ListItem
          title={'Pasteurs'}
          position={['first']}
          leftImage={'account-outline'}
          leftImageType={'material-community'}
          onPress={() => navigation.navigate('AdminPasteursList')}
        />
        <ListItem
          title={'Sermons'}
          leftImage={'cross-outline'}
          leftImageType={'material-community'}
          onPress={() => navigation.navigate('AdminSermonsList')}
        />
        <ListItem
          title={'Content'}
          position={['last']}
          leftImage={'file-document-edit-outline'}
          leftImageType={'material-community'}
          // onPress={() => navigation.navigate('')}
        />
        <Divider />
        <ListItem
          title={'Push Notifications'}
          position={['first', 'last']}
          leftImage={'bell-outline'}
          leftImageType={'material-community'}
          // onPress={() => navigation.navigate('')}
        />
        <Divider />
        <ListItem
          title={'Users'}
          position={['first', 'last']}
          leftImage={'account-multiple-outline'}
          leftImageType={'material-community'}
          // onPress={() => navigation.navigate('')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminHomeScreen;
