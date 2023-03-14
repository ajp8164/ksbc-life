import { AppTheme, useTheme } from 'theme';
import React, { useImperativeHandle, useState } from 'react';
import { Text, View } from 'react-native';
import { TextViewMethods, TextViewProps } from './types';

import { Input } from '@rneui/base';
import { makeStyles } from '@rneui/themed';

type TextView = TextViewMethods;

const TextView = React.forwardRef<TextView, TextViewProps>((props, ref) => {
  const {
    characterLimit = 0,
    containerStyle,
    onTextChanged,
    placeholder = 'Enter text here',
    textHeight,
    value,
  } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const [text, setText] = useState(value);
  const [countRemaining, setCountRemaining] = useState(characterLimit);

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    getText,
  }));

  const getText = () => {
    return text;
  };

  return (
    <>
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
            setText(t.slice(0, characterLimit));
            setCountRemaining(characterLimit - t.length);
            onTextChanged(t);
          }}
        />
      </View>
      {characterLimit ? (
        <Text style={s.remaining}>{`Characters left: ${countRemaining}`}</Text>
      ) : null}
    </>
  );
});

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  view: {
    paddingHorizontal: 5,
    // borderWidth: 1,
  },
  text: {
    ...theme.styles.textNormal,
    textAlignVertical: 'top',
  },
  remaining: {
    ...theme.styles.textSmall,
    ...theme.styles.textDim,
    textAlign: 'right',
    paddingRight: 15,
  },
}));

export default TextView;
