import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import {
  GestureResponderEvent,
  Platform,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { ImageSource } from 'react-native-vector-icons/Icon';
import { Card as RNULCard } from 'react-native-ui-lib';
import React from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { makeStyles } from '@rneui/themed';
import { viewport } from '@react-native-ajp-elements/ui';

interface VideoCardInterface {
  body?: string;
  bodyStyle?: TextStyle | TextStyle[];
  buttons?: {
    label?: string;
    icon?: string;
    iconType?: string;
    onPress: ((event: GestureResponderEvent) => void) | undefined;
  }[];
  cardStyle?: ViewStyle | ViewStyle[];
  footer?: string;
  footerStyle?: TextStyle | TextStyle[];
  header?: string;
  headerStyle?: TextStyle | TextStyle[];
  imageHeight?: number;
  imageSource?: ImageSource;
  imageWidth?: number | string;
  onPlayerStateChange?: (event: string) => void;
  onPressVideo?: ((event: GestureResponderEvent) => void) | undefined;
  playing?: boolean;
  showVideo?: boolean;
  title?: string;
  titleStyle?: TextStyle | TextStyle[];
  videoId: string;
}

const VideoCard = ({
  body,
  bodyStyle,
  buttons = [],
  cardStyle,
  footer,
  footerStyle,
  header,
  headerStyle,
  imageHeight,
  imageSource,
  imageWidth = 1, // Values <= 1 are used as percentage width
  onPlayerStateChange,
  onPressVideo,
  playing = true,
  showVideo,
  title,
  titleStyle,
  videoId,
}: VideoCardInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);

  imageWidth =
    typeof imageWidth === 'number' && imageWidth > 1
      ? imageWidth
      : typeof imageWidth === 'number'
      ? (viewport.width - 2 * Number(theme.styles.view.paddingHorizontal)) *
          Number(imageWidth) -
        2 * s.cardContent.paddingHorizontal
      : imageWidth;

  imageHeight =
    imageHeight || typeof imageWidth === 'number'
      ? ((imageWidth as number) * 9) / 16 - 2
      : 300;

  return (
    <RNULCard
      containerStyle={{ shadowColor: theme.colors.shadowColor }}
      style={[s.card, cardStyle]}>
      {showVideo ? (
        <View style={s.player}>
          <YoutubePlayer
            height={imageHeight}
            width={imageWidth as number}
            play={playing}
            videoId={videoId}
            webViewStyle={{
              borderRadius: 10,
            }}
            onChangeState={onPlayerStateChange}
          />
        </View>
      ) : (
        <TouchableOpacity onPress={onPressVideo}>
          <RNULCard.Section
            imageSource={imageSource}
            imageProps={{
              style: {
                ...s.videoPlaceholderImage,
                width: imageWidth,
                height: imageHeight,
              },
            }}
            style={s.videoSection}
          />
        </TouchableOpacity>
      )}
      <RNULCard.Section
        content={[
          { text: header, style: { ...s.cardHeader, ...headerStyle } },
          { text: title, style: { ...s.cardTitle, ...titleStyle } },
          { text: body, style: { ...s.cardBody, ...bodyStyle } },
          { text: footer, style: { ...s.cardFooter, ...footerStyle } },
        ]}
        style={s.cardContent}
      />
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
    </RNULCard>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  card: {
    marginTop: 15,
    backgroundColor: theme.colors.cardBackground,
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardTitle: {
    ...theme.styles.textHeading3,
    alignSelf: 'center',
  },
  cardBody: {
    ...theme.styles.textNormal,
  },
  cardFooter: {
    ...theme.styles.textNormal,
    ...theme.styles.textDim,
    alignSelf: 'center',
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
  player: {
    alignSelf: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
        backgroundColor: theme.colors.black,
      },
    }),
  },
  videoPlaceholderImage: {
    borderRadius: 10,
  },
  videoSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    shadowColor: theme.colors.black,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
        backgroundColor: theme.colors.black,
      },
    }),
  },
}));

export default VideoCard;
