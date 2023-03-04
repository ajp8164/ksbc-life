import {
  AdminNavigatorParamList,
  TabNavigatorParamList,
} from 'types/navigation';
import { AppTheme, useTheme } from 'theme';
import React, { useEffect } from 'react';
import { ScrollView, Text } from 'react-native';

import { Button } from '@rneui/base';
import { CompositeScreenProps } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dispatch } from 'store';
import { makeStyles } from '@rneui/themed';
import { saveAdminMode } from 'store/slices/appSettings';

type Props = CompositeScreenProps<
  NativeStackScreenProps<AdminNavigatorParamList, 'AdminHome'>,
  NativeStackScreenProps<TabNavigatorParamList>
>;

const AdminHomeScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

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
        <Text style={s.text}>{'hello'}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  text: {
    ...theme.styles.textNormal,
  },
}));

export default AdminHomeScreen;
