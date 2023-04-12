import * as React from 'react';

import { Animated, Text, View } from 'react-native';

import { Theme } from '../../types';
import { TypingAnimation } from 'react-native-typing-animation';
import styles from './styles';

export const TypingIndicator = React.memo(
  ({
    isTyping,
    theme,
    typingNames,
  }: {
    isTyping: boolean;
    theme: Theme;
    typingNames?: string;
  }) => {
    const { bubbleContainer, container, namesText } = styles({ theme });

    const yCoords = React.useRef(new Animated.Value(isTyping ? 0 : 500));
    const heightScale = React.useRef(
      new Animated.Value(isTyping ? (typingNames ? 60 : 35) : 0),
    );

    React.useEffect(() => {
      if (isTyping) {
        slideIn();
      } else {
        slideOut();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTyping]);

    const slideIn = () => {
      Animated.parallel([
        Animated.spring(yCoords.current, {
          toValue: 0,
          useNativeDriver: false,
        }),
        Animated.timing(heightScale.current, {
          toValue: typingNames ? 60 : 35,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    };

    const slideOut = () => {
      Animated.parallel([
        Animated.spring(yCoords.current, {
          toValue: 500,
          useNativeDriver: false,
        }),
        Animated.timing(heightScale.current, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    };

    return (
      <Animated.View
        style={[
          container,
          {
            transform: [{ translateY: yCoords.current }],
            height: heightScale.current,
          },
        ]}>
        {typingNames && <Text style={namesText}>{typingNames}</Text>}
        <View style={bubbleContainer}>
          <TypingAnimation
            dotRadius={4}
            dotMargin={5.5}
            dotColor={theme.typingIndicator.dotColor as string}
          />
        </View>
      </Animated.View>
    );
  },
);

export default TypingIndicator;
