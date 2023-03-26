import { AppTheme, useTheme } from 'theme';
import { Avatar, Icon, ListItem } from '@rneui/base';
import {
  ColorValue,
  ImageSourcePropType,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputFocusEventData,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import React from 'react';
import { makeStyles } from '@rneui/themed';

interface ListItemInput {
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  autoCorrect?: boolean;
  containerStyle?: ViewStyle | ViewStyle[];
  contentStyle?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  errorColor?: ColorValue;
  errorText?: string | undefined;
  extraContentComponentRight?: JSX.Element | null;
  inputTextStyle?: TextStyle | TextStyle[];
  keyboardType?: KeyboardTypeOptions;
  leftImage?: ImageSourcePropType | JSX.Element | string;
  leftImageColor?: ColorValue;
  leftImageSize?: number;
  leftImageType?: string;
  number?: boolean;
  position?: ('first' | 'last' | undefined)[];
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onChangeText?: (value: string) => void;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  placeholder?: string;
  placeholderTextColor?: ColorValue;
  refInner?: React.RefObject<TextInput>;
  rightImage?: ImageSourcePropType | JSX.Element | string;
  rightImageColor?: ColorValue;
  rightImageOnPress?: () => void;
  rightImageSize?: number;
  rightImageType?: string;
  secureTextEntry?: boolean;
  selectionColor?: ColorValue;
  title?: string;
  titleStyle?: TextStyle | TextStyle[];
  titleType?: 'inline' | 'material';
  value: string;
}

const ListItemInput = ({
  autoCapitalize,
  autoCorrect = true,
  containerStyle = {},
  contentStyle = {},
  disabled,
  errorColor,
  errorText,
  extraContentComponentRight = null,
  inputTextStyle,
  leftImage,
  leftImageColor,
  leftImageSize,
  leftImageType = 'ionicon',
  keyboardType = 'default',
  onBlur,
  onChangeText,
  onFocus,
  placeholder,
  placeholderTextColor,
  position,
  refInner,
  rightImage,
  rightImageColor,
  rightImageOnPress,
  rightImageSize,
  rightImageType = 'ionicon',
  secureTextEntry,
  selectionColor,
  title,
  titleStyle,
  titleType = 'inline',
  value,
}: ListItemInput) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const fullWidth = title === undefined || titleType === 'material';
  const error = errorText !== undefined;
  errorColor = errorColor || theme.colors.assertive;

  return (
    <>
      <ListItem
        bottomDivider={!position?.includes('last') || error}
        containerStyle={[
          theme.styles.listItemContainer,
          !rightImage ? { paddingRight: 0 } : {},
          position?.includes('first') ? s.first : {},
          position?.includes('last') ? s.last : {},
          error ? [s.fieldError, { borderColor: errorColor }] : {},
          titleType === 'material' ? { paddingTop: 20 } : {},
          containerStyle,
        ]}>
        {error && errorText && (
          <Text style={[s.errorText, { color: errorColor }]}>{errorText}</Text>
        )}
        {React.isValidElement(leftImage) ? (
          <ListItem.Content style={s.leftImageContent}>
            {leftImage}
          </ListItem.Content>
        ) : typeof leftImage === 'string' ? (
          <Icon
            name={leftImage}
            type={leftImageType}
            color={leftImageColor || theme.colors.icon}
            size={leftImageSize}
          />
        ) : leftImage !== undefined ? (
          <Avatar
            source={leftImage as ImageSourcePropType}
            imageProps={{ resizeMode: 'contain' }}
          />
        ) : null}
        {!fullWidth ? (
          <>
            <ListItem.Content
              style={[
                s.inputTitleContentStyle,
                leftImage ? s.leftImageOffset : {},
                error ? s.titleErrorOffset : {},
                disabled ? s.disabled : {},
              ]}>
              <ListItem.Title style={[theme.styles.listItemTitle, titleStyle]}>
                {title}
              </ListItem.Title>
            </ListItem.Content>
          </>
        ) : null}
        {!disabled ? ( // Substitute a disabled list item rather than disabling the input
          <ListItem.Content
            right={!fullWidth}
            style={[
              s.inputContentStyle,
              contentStyle,
              rightImage ? s.rightImageOffset : {},
              fullWidth && leftImage ? s.fullWidthLeftImageOffset : {},
              fullWidth && error ? { left: -15 } : {},
              fullWidth && titleType === 'material' && value ? { top: 5 } : {},
              fullWidth && titleType === 'material' && !value
                ? { top: -2 }
                : {},
            ]}>
            {titleType === 'material' && (
              <Text
                style={[
                  s.materialTitle,
                  titleStyle,
                  !value ? { opacity: 0 } : {},
                ]}>
                {title}
              </Text>
            )}
            <ListItem.Input
              ref={refInner}
              style={[
                theme.styles.textNormal,
                fullWidth ? s.inputFullWidth : {},
                inputTextStyle,
              ]}
              containerStyle={{ paddingHorizontal: 0 }}
              inputContainerStyle={{ overflow: 'scroll' }}
              selectionColor={selectionColor}
              placeholderTextColor={placeholderTextColor}
              placeholder={placeholder}
              keyboardType={keyboardType}
              keyboardAppearance={theme.mode}
              enablesReturnKeyAutomatically={true}
              selectTextOnFocus={true}
              autoCapitalize={autoCapitalize}
              autoCorrect={autoCorrect}
              secureTextEntry={secureTextEntry}
              disabled={disabled}
              value={value}
              onBlur={onBlur}
              onChangeText={onChangeText}
              onFocus={onFocus}
              inputAccessoryViewID={'inputAccessoryViewID'}
            />
            {extraContentComponentRight && (
              <View
                style={[
                  fullWidth ? (leftImage ? { left: 25 } : { left: 17 }) : {},
                ]}>
                {extraContentComponentRight}
              </View>
            )}
          </ListItem.Content>
        ) : (
          <ListItem.Content
            right={!fullWidth}
            style={[
              !fullWidth && s.inputContentStyle,
              contentStyle,
              rightImage ? s.rightImageOffset : {},
              fullWidth && leftImage ? s.fullWidthLeftImageOffset : {},
              fullWidth && error ? { left: -15 } : {},
              fullWidth && titleType === 'material' && value ? { top: 5 } : {},
              fullWidth && titleType === 'material' && !value
                ? { top: -2 }
                : {},
            ]}>
            {titleType === 'material' && (
              <Text
                style={[
                  s.materialTitle,
                  titleStyle,
                  !value ? { opacity: 0 } : {},
                ]}>
                {title}
              </Text>
            )}
            <ListItem.Title
              style={[
                theme.styles.listItemTitle,
                !fullWidth && title ? s.disabledValueOffset : {},
                s.disabled,
                inputTextStyle,
              ]}
              ellipsizeMode={'tail'}
              numberOfLines={1}>
              {value}
            </ListItem.Title>
          </ListItem.Content>
        )}
        {React.isValidElement(rightImage) && (
          <ListItem.Content right style={s.rightImageContent}>
            {rightImage}
          </ListItem.Content>
        )}
        {typeof rightImage === 'string' && (
          <Icon
            name={rightImage}
            type={rightImageType}
            color={rightImageColor || theme.colors.icon}
            size={rightImageSize}
            onPress={rightImageOnPress}
          />
        )}
      </ListItem>
    </>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  first: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  last: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  titleErrorOffset: {
    left: -16,
  },
  fullWidthLeftImageOffset: {
    left: -7,
  },
  leftImageOffset: {
    left: -7,
  },
  rightImageOffset: {
    marginRight: -10,
  },
  leftImageContent: {
    maxWidth: 25,
    // left: 10,
  },
  rightImageContent: {
    maxWidth: 25,
  },
  inputFullWidth: {
    textAlign: 'left',
    paddingRight: 7,
  },
  inputContentStyle: {
    height: 20,
    minWidth: '30%',
    flexDirection: 'row',
  },
  inputTitleContentStyle: {
    height: 20,
    minWidth: '30%',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledValueOffset: {
    textAlign: 'right',
    maxWidth: '30%',
    right: 27,
  },
  errorText: {
    ...theme.styles.textTiny,
    position: 'absolute',
    bottom: 0,
    right: 15,
  },
  fieldError: {},
  materialTitle: {
    ...theme.styles.textTiny,
    position: 'absolute',
    top: -17,
    left: 0,
  },
}));

export { ListItemInput };
