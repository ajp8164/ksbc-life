import React from 'react';

export declare type EditChurchModal = EditChurchModalMethods;

declare const ChurchModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    EditChurchModalProps & React.RefAttributes<EditChurchModalMethods>
  >
>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EditChurchModalProps {}

export interface EditChurchModalMethods {
  dismiss: () => void;
  present: (church: Church) => void;
}
