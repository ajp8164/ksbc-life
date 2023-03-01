import { AppTheme, useTheme } from 'theme';

import { GivingNavigatorParamList } from 'types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import { appConfig } from 'config';
import { makeStyles } from '@rneui/themed';

export type Props = NativeStackScreenProps<GivingNavigatorParamList, 'Giving'>;

const GivingBrowserScreen = () => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <View style={[theme.styles.view, s.view]}>
      <WebView
        source={{ uri: appConfig.givingUrl }}
        setSupportMultipleWindows={false}
      />
    </View>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  view: {
    paddingHorizontal: 0,
  },
}));

export default GivingBrowserScreen;
