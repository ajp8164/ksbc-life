import { AppTheme, useTheme } from 'theme';
import { Platform, Text, TextStyle, View, ViewStyle } from 'react-native';

import { Icon } from '@rneui/base';
import React from 'react';
import { makeStyles } from '@rneui/themed';

interface TextMessageInterface {
  containerStyle?: ViewStyle | ViewStyle[];
  iconColor?: string;
  iconName?: string;
  iconType?: string;
  text: string;
  textStyle?: TextStyle | TextStyle[];
}

const InfoMessage = ({
  containerStyle,
  iconColor,
  iconName = 'information-circle-outline',
  iconType = 'ionicon',
  text,
  textStyle,
}: TextMessageInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <View style={[s.container, containerStyle]}>
      <Icon
        name={iconName}
        type={iconType}
        color={iconColor || theme.colors.brandPrimary}
        size={25}
      />
      <Text style={[s.text, textStyle]}>{text}</Text>
    </View>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  container: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 10,
    width: '100%',
  },
  text: {
    ...theme.styles.textSmall,
    marginRight: 30,
    top: 5,
    left: 5,
    ...Platform.select({
      android: {
        top: 2,
      },
    }),
  },
}));

export default InfoMessage;
