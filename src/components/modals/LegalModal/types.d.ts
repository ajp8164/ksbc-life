import React from 'react';

export declare type LegalModal = LegalModalMethods;

declare const LegalModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    LegalModalProps & React.RefAttributes<LegalModalMethods>
  >
>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LegalModalProps {}

export interface LegalModalMethods {
  dismiss: () => void;
  present: () => void;
}
