import React from 'react';

export declare type EditUserModal = EditUserModalMethods;

declare const UserModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    EditUserModalProps & React.RefAttributes<EditUserModalMethods>
  >
>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EditUserModalProps {}

export interface EditUserModalMethods {
  dismiss: () => void;
  present: (title: string, user?: UserProfile) => void;
}
