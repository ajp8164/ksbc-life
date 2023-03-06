import React from 'react';

export declare type TextModal = TextModalMethods;

declare const LegalModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    TextModalProps & React.RefAttributes<TextModalMethods>
  >
>;

export interface TextModalProps {
  onDismiss: (text: string) => void;
  placeholder?: string;
}

export interface TextModalMethods {
  dismiss: () => void;
  present: () => void;
}
