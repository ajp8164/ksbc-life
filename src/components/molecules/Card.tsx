import { makeStyles } from '@rneui/themed';
import { AppTheme, useTheme } from 'theme';
import React from 'react';
import { Card as RNULCard } from 'react-native-ui-lib';
import { ImageSource } from 'react-native-vector-icons/Icon';
import {
  GestureResponderEvent,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Button, Icon } from '@rneui/base';

interface CardInterface {
  body?: string;
  bodyStyle?: TextStyle | TextStyle[];
  buttons?: {
    label?: string;
    icon?: string;
    iconType?: string;
    onPress: ((event: GestureResponderEvent) => void) | undefined;
  }[];
  cardStyle?: ViewStyle | ViewStyle[];
  flexBasis?: number | string;
  footer?: string;
  footerStyle?: TextStyle | TextStyle[];
  imageHeight?: number;
  imageSource?: ImageSource;
  title?: string;
  titleStyle?: TextStyle | TextStyle[];
  width?: number | string;
}

const Card = ({
  body,
  bodyStyle,
  buttons = [],
  cardStyle,
  flexBasis = '100%',
  footer,
  footerStyle,
  imageHeight = 100,
  imageSource,
  title,
  titleStyle,
  width = '100%',
}: CardInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);
  const hasText = title || body || footer;

  return (
    <RNULCard
      style={[
        { flexBasis },
        s.card,
        hasText ? {} : { paddingVertical: 10 },
        cardStyle,
      ]}>
      {hasText && (
        <RNULCard.Section
          content={[
            { text: title, style: { ...s.cardTitle, ...titleStyle } },
            { text: body, style: { ...s.cardBody, ...bodyStyle } },
            { text: footer, style: { ...s.cardFooter, ...footerStyle } },
          ]}
          style={s.cardContent}
        />
      )}
      {buttons.length > 0 && (
        <View style={s.cardButtonContainer}>
          {buttons.map(b => {
            return (
              <Button
                type="clear"
                title={b.label}
                icon={
                  b.icon ? (
                    <Icon
                      name={b.icon}
                      type={b.iconType || 'material-community'}
                      color={theme.colors.brandSecondary}
                      size={22}
                    />
                  ) : undefined
                }
                buttonStyle={[theme.styles.buttonClear, s.cardButton]}
                titleStyle={s.cardButtonText}
                onPress={b.onPress}
              />
            );
          })}
        </View>
      )}
      <RNULCard.Section
        imageSource={imageSource}
        imageStyle={{
          width,
          height: imageHeight,
          resizeMode: hasText ? 'cover' : 'contain',
        }}
      />
    </RNULCard>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  card: {
    marginTop: 15,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    ...theme.styles.textHeading3,
    textAlign: 'center',
  },
  cardBody: {
    ...theme.styles.textNormal,
  },
  cardFooter: {
    ...theme.styles.textSmall,
    ...theme.styles.textDim,
    paddingTop: 10,
  },
  cardButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    right: 20,
    marginTop: -20,
  },
  cardButton: {
    padding: 0,
    paddingRight: 0,
    paddingLeft: 20,
    minWidth: 0,
  },
  cardButtonText: {
    ...theme.styles.textSmall,
    ...theme.styles.textBold,
    paddingLeft: 5,
    color: theme.colors.brandSecondary,
  },
}));

export default Card;
