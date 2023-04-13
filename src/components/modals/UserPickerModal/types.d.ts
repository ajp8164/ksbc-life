import React from 'react';
import { UserProfile } from 'types/user';

export declare type UserPickerModal = UserPickerModalMethods;

declare const LegalModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    UserPickerModalProps & React.RefAttributes<UserPickerModalMethods>
  >
>;

export interface UserPickerModalProps {
  headerTitle?: string;
  multiple?: boolean;
  onDeselect?: (userProfile: UserProfile) => void;
  onSelect: (userProfile: UserProfile) => void;
  selected: UserProfile[];
  snapPoints?: (string | number)[];
  userProfiles: UserProfile[];
}

export interface UserPickerModalMethods {
  dismiss: () => void;
  present: () => void;
}
