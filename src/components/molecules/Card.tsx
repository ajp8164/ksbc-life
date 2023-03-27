import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import {
  GestureResponderEvent,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, { ReactNode } from 'react';

import { ImageSource } from 'react-native-vector-icons/Icon';
import { Card as RNULCard } from 'react-native-ui-lib';
import { makeStyles } from '@rneui/themed';

interface CardInterface {
  body?: string;
  bodyStyle?: TextStyle | TextStyle[];
  BodyComponent?: ReactNode;
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
  header?: string;
  headerStyle?: TextStyle | TextStyle[];
  imageHeight?: number;
  imageSource?: ImageSource;
  imageWidth?: number | string;
  title?: string;
  titleStyle?: TextStyle | TextStyle[];
}

const Card = ({
  body,
  bodyStyle,
  BodyComponent,
  buttons = [],
  cardStyle,
  flexBasis = '100%',
  footer,
  footerStyle,
  header,
  headerStyle,
  imageHeight = 100,
  imageSource,
  imageWidth = '100%',
  title,
  titleStyle,
}: CardInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);
  const hasText = title || header || body || footer;

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
            { text: header, style: { ...s.cardHeader, ...headerStyle } },
            { text: title, style: { ...s.cardTitle, ...titleStyle } },
            { text: body, style: { ...s.cardBody, ...bodyStyle } },
            { text: footer, style: { ...s.cardFooter, ...footerStyle } },
          ]}
          style={s.cardContent}
        />
      )}
      {BodyComponent}
      {buttons.length > 0 && (
        <View style={s.cardButtonContainer}>
          {buttons.map(b => {
            return (
              <Button
                key={b.label}
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
          width: imageWidth,
          height: imageHeight,
          // resizeMode: hasText ? 'cover' : 'contain',
          resizeMode: 'cover',
        }}
      />
    </RNULCard>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  card: {
    backgroundColor: theme.colors.cardBackground,
    minHeight: 100,
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
  cardHeader: {
    ...theme.styles.textNormal,
    alignSelf: 'center',
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
