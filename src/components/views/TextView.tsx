import { AppTheme, useTheme } from 'theme';
import { Platform, StatusBar, View } from 'react-native';

import { Input } from '@rneui/base';
import React from 'react';
import { makeStyles } from '@rneui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { viewport } from '@react-native-ajp-elements/ui';

interface TextViewInterface {
  placeholder?: string;
  viewableHeightPercentage?: number;
}

const TextView = ({
  placeholder = 'Enter text here',
  viewableHeightPercentage = 1,
}: TextViewInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const insets = useSafeAreaInsets();
  const visibleHeight =
    viewport.height * viewableHeightPercentage -
    insets.top -
    insets.bottom -
    (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0);

  const [text, onChangeText] = React.useState('');

  return (
    <View style={[theme.styles.viewAlt, { paddingHorizontal: 0 }]}>
      <Input
        style={[s.text, { height: visibleHeight }]}
        inputContainerStyle={{ borderBottomWidth: 0 }}
        multiline={true}
        placeholder={placeholder}
        value={text}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  text: {
    ...theme.styles.textNormal,
    textAlignVertical: 'top',
  },
}));

export default TextView;
