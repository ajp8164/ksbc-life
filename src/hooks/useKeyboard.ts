import {
  Animated,
  Keyboard,
  KeyboardEventListener,
  ScreenRect,
} from 'react-native';
import { useEffect, useState } from 'react';

import { useAnimatedValue } from './useAnimatedValue';

export function useKeyboard() {
  const [shown, setShown] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    start: ScreenRect;
    end: ScreenRect;
  }>({
    start: { screenX: 0, screenY: 0, width: 0, height: 0 },
    end: { screenX: 0, screenY: 0, width: 0, height: 0 },
  });
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const animatedKeyboardHeight = useAnimatedValue(0);

  const handleKeyboardWillShow: KeyboardEventListener = e => {
    setCoordinates({ start: e.startCoordinates, end: e.endCoordinates });
    console.log('START');
    // Start raise keyboard animated value
    Animated.timing(animatedKeyboardHeight, {
      duration: e.duration,
      toValue: e.endCoordinates.height,
      useNativeDriver: true,
    }).start();
  };
  const handleKeyboardDidShow: KeyboardEventListener = e => {
    setShown(true);
    setCoordinates({ start: e.startCoordinates, end: e.endCoordinates });
    setKeyboardHeight(e.endCoordinates.height);
  };
  const handleKeyboardWillHide: KeyboardEventListener = e => {
    setCoordinates({ start: e.startCoordinates, end: e.endCoordinates });
    console.log('END');

    // Start close keyboard animated value
    Animated.timing(animatedKeyboardHeight, {
      duration: e.duration,
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };
  const handleKeyboardDidHide: KeyboardEventListener = e => {
    setShown(false);
    if (e) {
      setCoordinates({ start: e.startCoordinates, end: e.endCoordinates });
    }
    setKeyboardHeight(0);
  };

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', handleKeyboardWillShow);
    Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
    Keyboard.addListener('keyboardWillHide', handleKeyboardWillHide);
    Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

    return () => {
      Keyboard.removeAllListeners('keyboardWillShow');
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardWillHide');
      Keyboard.removeAllListeners('keyboardDidHide');
      animatedKeyboardHeight.stopAnimation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    keyboardShown: shown,
    coordinates,
    keyboardHeight,
    animatedKeyboardHeight,
  };
}
