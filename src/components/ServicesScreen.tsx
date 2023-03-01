import { AppTheme, useTheme } from 'theme';
import { ScrollView, Text } from 'react-native';

import { ServicesNavigatorParamList } from 'types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeStyles } from '@rneui/themed';

export type Props = NativeStackScreenProps<
  ServicesNavigatorParamList,
  'Services'
>;

const ServicesScreen = () => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Text>{'hello'}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({}));

export default ServicesScreen;
