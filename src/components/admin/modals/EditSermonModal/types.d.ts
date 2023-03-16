import React from 'react';

export declare type EditSermonModal = EditSermonModalMethods;

declare const LegalModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    EditSermonModalProps & React.RefAttributes<EditSermonModalMethods>
  >
>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EditSermonModalProps {}

export interface EditSermonModalMethods {
  dismiss: () => void;
  present: (title: string, sermon?: Pasteur) => void;
}
