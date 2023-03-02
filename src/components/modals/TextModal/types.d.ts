import React from 'react';

export declare type TextModal = ModalMethods;

declare const LegalModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    ModalProps & React.RefAttributes<ModalMethods>
  >
>;

export interface TextModalProps {
  placeholder?: string;
}

export interface TextModalMethods {
  dismiss: () => void;
  present: () => void;
}
