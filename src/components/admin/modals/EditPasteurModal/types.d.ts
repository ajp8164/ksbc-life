import React from 'react';

export declare type EditPasteurModal = EditPasteurModalMethods;

declare const LegalModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    EditPasteurModalProps & React.RefAttributes<EditPasteurModalMethods>
  >
>;

export interface EditPasteurModalProps {
  pasteur?: Pasteur;
}

export interface EditPasteurModalMethods {
  dismiss: () => void;
  present: (title: string) => void;
}
