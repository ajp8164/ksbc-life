import * as React from 'react';

import {
  AttachmentButton,
  AttachmentButtonAdditionalProps,
} from '../AttachmentButton';
import { L10nContext, ThemeContext, UserContext, unwrap } from '../../utils';
import { LayoutChangeEvent, TextInput, View } from 'react-native';

import { CircularActivityIndicator } from '../CircularActivityIndicator';
import { MessageType } from '../../types';
import { SendButton } from '../SendButton';
import styles from './styles';

export interface InputTopLevelProps {
  /** Whether attachment is uploading. Will replace attachment button with a
   * {@link CircularActivityIndicator}. Since we don't have libraries for
   * managing media in dependencies we have no way of knowing if
   * something is uploading so you need to set this manually. */
  isAttachmentUploading?: boolean;
  /** @see {@link AttachmentButtonProps.onPress} */
  onAttachmentPress?: () => void;
  /** Returns the layout for the composer. */
  onLayout?: (event: LayoutChangeEvent) => void;
  /** Will be called on {@link SendButton} tap. Has {@link MessageType.PartialText} which can
   * be transformed to {@link MessageType.Text} and added to the messages list. */
  onSendPress: (message: MessageType.PartialText) => void;
  /** Controls the visibility behavior of the {@link SendButton} based on the
   * `TextInput` state. Defaults to `editing`. */
  sendButtonVisibilityMode?: 'always' | 'editing';
}

export interface InputAdditionalProps {
  attachmentButtonProps?: AttachmentButtonAdditionalProps;
}

export type InputProps = InputTopLevelProps & InputAdditionalProps;

/** Bottom bar input component with a text input, attachment and
 * send buttons inside. By default hides send button when text input is empty. */
export const Input = ({
  attachmentButtonProps,
  isAttachmentUploading,
  onAttachmentPress,
  onLayout,
  onSendPress,
  sendButtonVisibilityMode,
}: InputProps) => {
  const l10n = React.useContext(L10nContext);
  const theme = React.useContext(ThemeContext);
  const user = React.useContext(UserContext);
  const { container, input, marginRight } = styles({ theme });

  // Use `defaultValue` if provided
  const [text, setText] = React.useState('');

  const value = text;

  const handleChangeText = (newText: string) => {
    // Track local state in case `onChangeText` is provided and `value` is not
    setText(newText);
  };

  const handleSend = () => {
    const trimmedValue = value.trim();

    // Impossible to test since button is not visible when value is empty.
    // Additional check for the keyboard input.
    /* istanbul ignore next */
    if (trimmedValue) {
      onSendPress({ text: trimmedValue, type: 'text' });
      setText('');
    }
  };

  return (
    <View style={[container, theme.composer.container]} onLayout={onLayout}>
      {user &&
        (isAttachmentUploading ? (
          <View style={marginRight}>
            <CircularActivityIndicator
              {...{
                color: theme.composer.activityIndicator.color,
                size: theme.composer.activityIndicator.size,
              }}
            />
          </View>
        ) : (
          !!onAttachmentPress && (
            <AttachmentButton
              {...unwrap(attachmentButtonProps)}
              onPress={onAttachmentPress}
            />
          )
        ))}
      <TextInput
        multiline
        placeholder={l10n.inputPlaceholder}
        placeholderTextColor={
          theme.composer.inputStyle.color
            ? `${String(theme.composer.inputStyle.color)}80`
            : undefined
        }
        underlineColorAndroid="transparent"
        // Keep our implementation but allow user to use these `TextInputProps`
        style={input}
        onChangeText={handleChangeText}
        value={value}
      />
      {sendButtonVisibilityMode === 'always' ||
      (sendButtonVisibilityMode === 'editing' && user && value.trim()) ? (
        <SendButton onPress={handleSend} />
      ) : null}
    </View>
  );
};
