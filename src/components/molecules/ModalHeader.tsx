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
  title,
}: ModalHeaderInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const onHeaderLayout = (event: LayoutChangeEvent) => {
    onLayout && onLayout(event);
  };

  return (
    <View style={s.view} onLayout={onHeaderLayout}>
      <Text style={s.title}>{title}</Text>
      <Button
        type={'clear'}
        containerStyle={{ position: 'absolute', right: 15 }}
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
  view: {
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  title: {
    ...theme.styles.textHeading1,
    fontSize: 34.5,
    letterSpacing: -1.7,
    marginTop: 30,
  },
}));

export default ModalHeader;
