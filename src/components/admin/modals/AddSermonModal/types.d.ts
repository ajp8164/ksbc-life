import React from 'react';

export declare type AddSermonModal = AddSermonModalMethods;

declare const LegalModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    AddSermonModalProps & React.RefAttributes<AddSermonModalMethods>
  >
>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AddSermonModalProps {}

export interface AddSermonModalMethods {
  dismiss: () => void;
  present: () => void;
}
