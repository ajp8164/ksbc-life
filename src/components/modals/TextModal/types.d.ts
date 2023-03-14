import React from 'react';

export declare type TextModal = TextModalMethods;

declare const LegalModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    TextModalProps & React.RefAttributes<TextModalMethods>
  >
>;

export interface TextModalProps {
  characterLimit?: number;
  headerTitle?: string;
  onDismiss: (text: string) => void;
  placeholder?: string;
  textContainerStyle?: ViewStyle | ViewStyle[];
  value?: string;
}

export interface TextModalMethods {
  dismiss: () => void;
  present: () => void;
}
