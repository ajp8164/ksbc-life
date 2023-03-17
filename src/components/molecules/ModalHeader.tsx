import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import { LayoutChangeEvent, Text, View } from 'react-native';

import { makeStyles } from '@rneui/themed';

interface ModalHeaderInterface {
  onLayout?: (event: LayoutChangeEvent) => void;
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
  onLayout,
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
        containerStyle={size === 'large' ? s.containerLarge : s.containerSmall}
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
  },
  containerLarge: {
    position: 'absolute',
    right: 15,
  },
  containerSmall: {
    position: 'absolute',
    right: 15,
  },
  buttonLarge: {},
  buttonSmall: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  titleLarge: {
    ...theme.styles.textHeading1,
    fontSize: 34.5,
    letterSpacing: -1.7,
    marginTop: 30,
  },
  titleSmall: {
    ...theme.styles.textHeading4,
    marginVertical: 10,
  },
}));

export default ModalHeader;
