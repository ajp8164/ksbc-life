import React from 'react';
import { ViewStyle } from 'react-native/types';

export declare type TextView = TextViewMethods;

declare const TextView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    TextViewProps & React.RefAttributes<TextViewMethods>
  >
>;

export interface TextViewProps {
  containerStyle?: ViewStyle | ViewStyle[];
  onTextChanged: (text: string) => void;
  placeholder?: string;
  value?: string;
  // viewableHeightPercentage?: number;
  textHeight: number;
}

export interface TextViewMethods {
  getText: () => void;
}
