import { Animated } from 'react-native';
import { useRef } from 'react';

export const useAnimatedValue = (initialValue: number): Animated.Value => {
  const ref = useRef(new Animated.Value(initialValue));
  return ref.current;
};
