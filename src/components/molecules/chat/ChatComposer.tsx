import {
  ComposerProps,
  Composer as GCComposer,
} from 'react-native-gifted-chat';

import React from 'react';
import { appConfig } from 'config';
import { useTheme } from 'theme';

export const renderComposer = (props: ComposerProps) => {
  return <Composer {...props} />;
};

export const Composer = (props: ComposerProps) => {
  const theme = useTheme();
  return (
    <GCComposer
      {...props}
      placeholder={`${appConfig.businessNameShort} message`}
      placeholderTextColor={theme.colors.textPlaceholder}
      textInputStyle={{
        color: theme.colors.text,
        backgroundColor: theme.colors.white,
        borderColor: theme.colors.midGray,
        borderWidth: 1,
        borderRadius: 5,
        paddingTop: 8.5,
        paddingHorizontal: 12,
        marginLeft: 0,
        marginRight: 10,
      }}
    />
  );
};
