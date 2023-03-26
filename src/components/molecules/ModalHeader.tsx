import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import { LayoutChangeEvent, Text, View } from 'react-native';

import { makeStyles } from '@rneui/themed';

interface ModalHeaderInterface {
  leftButtonDisabled?: boolean;
  leftButtonText?: string;
  leftButtonIcon?: string;
  leftButtonIconColor?: string;
  leftButtonIconSize?: number;
  leftButtonIconType?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  onLeftButtonPress?: () => void;
  onRightButtonPress?: () => void;
  rightButtonDisabled?: boolean;
  rightButtonText?: string;
  rightButtonIcon?: string;
  rightButtonIconColor?: string;
  rightButtonIconSize?: number;
  rightButtonIconType?: string;
  size?: 'small' | 'large';
  title: string;
}

const ModalHeader = ({
  leftButtonDisabled,
  leftButtonText,
  leftButtonIcon,
  leftButtonIconColor,
  leftButtonIconSize = 28,
  leftButtonIconType = 'material-community',
  onLayout,
  onLeftButtonPress,
  onRightButtonPress,
  rightButtonDisabled,
  rightButtonText,
  rightButtonIcon,
  rightButtonIconColor,
  rightButtonIconSize = 28,
  rightButtonIconType = 'material-community',
  size = 'large',
  title,
}: ModalHeaderInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const onHeaderLayout = (event: LayoutChangeEvent) => {
    onLayout && onLayout(event);
  };

  return (
    <View
      style={size === 'large' ? s.viewLarge : s.viewSmall}
      onLayout={onHeaderLayout}>
      <Text style={size === 'large' ? s.titleLarge : s.titleSmall}>
        {title}
      </Text>
      <Button
        type={'clear'}
        containerStyle={
          size === 'large' ? s.containerLeftLarge : s.containerLeftSmall
        }
        buttonStyle={size === 'large' ? s.buttonLarge : s.buttonSmall}
        title={leftButtonText}
        icon={
          leftButtonIcon ? (
            <Icon
              name={leftButtonIcon}
              type={leftButtonIconType}
              color={leftButtonIconColor}
              size={leftButtonIconSize}
            />
          ) : undefined
        }
        disabled={leftButtonDisabled}
        onPress={onLeftButtonPress}
      />
      <Button
        type={'clear'}
        containerStyle={
          size === 'large' ? s.containerRightLarge : s.containerRightSmall
        }
        buttonStyle={size === 'large' ? s.buttonLarge : s.buttonSmall}
        title={rightButtonText}
        icon={
          rightButtonIcon ? (
            <Icon
              name={rightButtonIcon}
              type={rightButtonIconType}
              color={rightButtonIconColor}
              size={rightButtonIconSize}
            />
          ) : undefined
        }
        disabled={rightButtonDisabled}
        onPress={onRightButtonPress}
      />
    </View>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  viewLarge: {
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  viewSmall: {
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerLeftLarge: {
    position: 'absolute',
    left: 5,
  },
  containerLeftSmall: {
    position: 'absolute',
    left: 5,
  },
  containerRightLarge: {
    position: 'absolute',
    right: 10,
  },
  containerRightSmall: {
    position: 'absolute',
    right: 10,
  },
  buttonLarge: {},
  buttonSmall: {},
  titleLarge: {
    ...theme.styles.textHeading1,
    fontSize: 34.5,
    letterSpacing: -1.7,
    marginTop: 45,
  },
  titleSmall: {
    ...theme.styles.textLarge,
    ...theme.styles.textBold,
    marginVertical: 8,
  },
}));

export default ModalHeader;
