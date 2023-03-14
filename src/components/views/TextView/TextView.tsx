import { AppTheme, useTheme } from 'theme';
import React, { useImperativeHandle } from 'react';
import { TextViewMethods, TextViewProps } from './types';

import { Input } from '@rneui/base';
import { View } from 'react-native';
import { makeStyles } from '@rneui/themed';

type TextView = TextViewMethods;

const TextView = React.forwardRef<TextView, TextViewProps>((props, ref) => {
  const {
    containerStyle,
    onTextChanged,
    placeholder = 'Enter text here',
    textHeight,
    value,
  } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const [text, setText] = React.useState(value);

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    getText,
  }));

  const getText = () => {
    return text;
  };

  return (
    <View
      style={[
        theme.styles.viewAlt,
        s.view,
        { height: textHeight },
        containerStyle,
      ]}>
      <Input
        style={[s.text]}
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
  view: {
    paddingHorizontal: 5,
    borderWidth: 1,
  },
  text: {
    ...theme.styles.textNormal,
    textAlignVertical: 'top',
  },
}));

export default TextView;
