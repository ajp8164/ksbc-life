import React from 'react';
import { UserStatus } from 'types/user';

export declare type UserStatusPickerModal = UserStatusPickerModalMethods;

declare const UserStatusPickerModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    UserStatusPickerModalProps &
      React.RefAttributes<UserStatusPickerModalMethods>
  >
>;

export interface UserStatusPickerModalProps {
  disabled: boolean;
  onDismiss: (userStatus: UserStatus) => void;
  value: UserStatus;
}

export interface UserStatusPickerModalMethods {
  dismiss: (userStatus?: UserStatus) => void;
  present: () => void;
}
