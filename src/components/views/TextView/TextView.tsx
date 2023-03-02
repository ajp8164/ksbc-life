import { AppTheme, useTheme } from 'theme';
import { Platform, StatusBar, View } from 'react-native';
import React, { useImperativeHandle } from 'react';
import { TextViewMethods, TextViewProps } from './types';

import { Input } from '@rneui/base';
import { makeStyles } from '@rneui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { viewport } from '@react-native-ajp-elements/ui';

type TextView = TextViewMethods;

const TextView = React.forwardRef<TextView, TextViewProps>((props, ref) => {
  const {
    onTextChanged,
    placeholder = 'Enter text here',
    viewableHeightPercentage = 1,
  } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const insets = useSafeAreaInsets();
  const visibleHeight =
    viewport.height * viewableHeightPercentage -
    insets.top -
    insets.bottom -
    (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0);

  const [text, setText] = React.useState('');

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    getText,
  }));

  const getText = () => {
    return text;
  };

  return (
    <View style={[theme.styles.viewAlt, { paddingHorizontal: 0 }]}>
      <Input
        style={[s.text, { height: visibleHeight }]}
        inputContainerStyle={{ borderBottomWidth: 0 }}
        multiline={true}
        placeholder={placeholder}
        value={text}
        onChangeText={t => {
          setText(t);
          onTextChanged(t);
        }}
      />
    </View>
  );
});

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  text: {
    ...theme.styles.textNormal,
    textAlignVertical: 'top',
  },
}));

export default TextView;
