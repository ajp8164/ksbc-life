import { AppTheme, useTheme } from 'theme';
import { Text, View } from 'react-native';

import { NewSermonViewMethods } from './types';
import React from 'react';
import { makeStyles } from '@rneui/themed';

type NewSermonView = NewSermonViewMethods;

const NewSermonView = () => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <View style={[theme.styles.viewAlt, { paddingHorizontal: 0 }]}>
      <Text>{'hello'}</Text>
    </View>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({}));

export default NewSermonView;
