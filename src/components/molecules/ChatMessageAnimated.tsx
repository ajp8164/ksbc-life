import { Message, MessageProps } from 'react-native-gifted-chat';
import React, { useEffect, useState } from 'react';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ChatMessage } from 'types/chatMessage';
import { LayoutChangeEvent } from 'react-native';

const springConfig = {
  damping: 10,
  mass: 1,
  stiffness: 100,
  overshootClamping: true,
  restSpeedThreshold: 0.01,
  restDisplacementThreshold: 2,
  // velocity: 10,
};

export type CustomMessageProps = MessageProps<ChatMessage> & {
  isInitializing: boolean;
};

export const ChatMessageAnimated = React.memo((props: CustomMessageProps) => {
  const messageHeight = useSharedValue<undefined | number>(undefined);
  const [heightState, setHeightState] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (heightState !== 0) {
      setDone(true);
      messageHeight.value = withSpring(heightState, springConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heightState]);

  const transitionStyle = useAnimatedStyle(() => {
    return { height: messageHeight.value };
  }, []);

  const onLayout = (e: LayoutChangeEvent) => {
    const tempHeight = e.nativeEvent.layout.height;
    if (!done) {
      messageHeight.value = 0;
      setHeightState(tempHeight);
    }
  };

  return (
    <Reanimated.View
      onLayout={onLayout}
      style={
        // During initialiation we do not animate the messages into the ui.
        // This is a ux preference decision.
        !props.isInitializing && [
          {
            position: heightState !== 0 ? undefined : 'absolute',
            overflow: 'hidden',
          },
          transitionStyle,
        ]
      }>
      <Message {...props} />
    </Reanimated.View>
  );
});
