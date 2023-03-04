import {
  AdminNavigatorParamList,
  TabNavigatorParamList,
} from 'types/navigation';
import { AppTheme, useTheme } from 'theme';
import React, { useEffect } from 'react';

import { CompositeScreenProps } from '@react-navigation/core';
import { Divider } from '@react-native-ajp-elements/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { selectSermon } from 'store/selectors/adminSelectors';
import { useSelector } from 'react-redux';

type Props = CompositeScreenProps<
  NativeStackScreenProps<AdminNavigatorParamList, 'AdminSermon'>,
  NativeStackScreenProps<TabNavigatorParamList>
>;

const AdminSermonScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const sermon = useSelector(selectSermon(route.params?.sermonId));

  useEffect(() => {
    navigation.setOptions({
      title: sermon?.title || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Divider />
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  text: {
    ...theme.styles.textNormal,
  },
}));

export default AdminSermonScreen;
