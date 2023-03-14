import { Pasteur } from 'types';
import React from 'react';

export declare type EditPasteurModal = EditPasteurModalMethods;

declare const LegalModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    EditPasteurModalProps & React.RefAttributes<EditPasteurModalMethods>
  >
>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EditPasteurModalProps {}

export interface EditPasteurModalMethods {
  dismiss: () => void;
  present: (title: string, pasteur?: Pasteur) => void;
}
