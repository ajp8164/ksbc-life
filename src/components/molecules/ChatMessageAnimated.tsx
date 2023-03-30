import React, { useEffect, useState } from 'react';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { LayoutChangeEvent } from 'react-native';
import { Message } from 'react-native-gifted-chat';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ChatMessageAnimated = React.memo((props: any) => {
  const messageHeight = useSharedValue<undefined | number>(undefined);
  const [heightState, setHeightState] = useState(0);
  const [done, setDone] = useState(false);

  const transitionStyle = useAnimatedStyle(() => {
    return {
      height: messageHeight.value,
    };
  }, []);

  const onLayout = (e: LayoutChangeEvent) => {
    const tempHeight = e.nativeEvent.layout.height;
    if (!done) {
      messageHeight.value = 0;
      setHeightState(tempHeight);
    }
  };

  const springConfig = {
    damping: 10,
    mass: 1,
    stiffness: 100,
    overshootClamping: true,
    restSpeedThreshold: 0.01,
    restDisplacementThreshold: 2,
    // velocity: 10,
  };

  useEffect(() => {
    if (heightState !== 0) {
      setDone(true);
      messageHeight.value = withSpring(heightState, springConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heightState]);
  console.log('.');
  return (
    <Reanimated.View
      onLayout={onLayout}
      style={[
        {
          position: heightState !== 0 ? undefined : 'absolute',
          overflow: 'hidden',
        },
        transitionStyle,
      ]}>
      <Message {...props} />
    </Reanimated.View>
  );
});
