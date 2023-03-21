import React from 'react';
import { UserRole } from 'types/user';

export declare type UserRolePickerModal = UserRolePickerModalMethods;

declare const UserRolePickerModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    UserRolePickerModalProps & React.RefAttributes<UserRolePickerModalMethods>
  >
>;

export interface UserRolePickerModalProps {
  disabled: boolean;
  onDismiss: (userRole: UserRole) => void;
  value: UserRole;
}

export interface UserRolePickerModalMethods {
  dismiss: (userRole?: UserRole) => void;
  present: () => void;
}
