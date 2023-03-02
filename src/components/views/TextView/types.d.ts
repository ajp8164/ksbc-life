import React from 'react';

export declare type TextView = TextViewMethods;

declare const TextView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    TextViewProps & React.RefAttributes<TextViewMethods>
  >
>;

export interface TextViewProps {
  onTextChanged: (text: string) => void;
  placeholder?: string;
  viewableHeightPercentage?: number;
}

export interface TextViewMethods {
  getText: () => void;
}
