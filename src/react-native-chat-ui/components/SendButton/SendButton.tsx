import * as React from 'react';

import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { L10nContext, ThemeContext } from '../../utils';

export interface SendButtonPropsAdditionalProps {
  touchableOpacityProps?: TouchableOpacityProps;
}

export interface SendButtonProps extends SendButtonPropsAdditionalProps {
  disabled?: boolean;
  /** Callback for send button tap event */
  onPress: () => void;
}

export const SendButton = ({
  disabled = false,
  onPress,
  touchableOpacityProps,
}: SendButtonProps) => {
  const l10n = React.useContext(L10nContext);
  const theme = React.useContext(ThemeContext);

  const handlePress = (event: GestureResponderEvent) => {
    onPress();
    touchableOpacityProps?.onPress?.(event);
  };

  return (
    <TouchableOpacity
      accessibilityLabel={l10n.sendButtonAccessibilityLabel}
      accessibilityRole="button"
      {...touchableOpacityProps}
      onPress={handlePress}
      disabled={disabled}
      style={[styles.sendButton, disabled ? styles.disabled : {}]}>
      {theme.icons?.sendButtonIcon?.() ?? (
        <Image
          source={require('../../assets/icon-send.png')}
          style={theme.composer.sendIcon}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: { opacity: 0.25 },
  sendButton: {
    marginLeft: 16,
  },
});
