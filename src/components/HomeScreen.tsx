import { AppTheme, useTheme } from 'theme';
import { ScrollView, Text } from 'react-native';
import React from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { makeStyles } from '@rneui/themed';

const HomeScreen = () => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <SafeAreaView
      edges={['top']}
      style={[theme.styles.viewAlt, s.viewBackground]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={theme.styles.textNormal}>{'Hello'}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  viewBackground: {
    backgroundColor: theme.colors.transparent,
    paddingHorizontal: 0,
  },
}));

export default HomeScreen;
