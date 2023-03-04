import React from 'react';

export declare type NewSermonModal = ModalMethods;

declare const LegalModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    NewSermonModalProps & React.RefAttributes<NewSermonModalMethods>
  >
>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NewSermonModalProps {}

export interface NewSermonModalMethods {
  dismiss: () => void;
  present: () => void;
}
