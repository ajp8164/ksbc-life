import React from 'react';
import { UserProfile } from 'types/user';

export declare type UsersView = UsersViewMethods;

declare const UsersView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    UsersViewProps & React.RefAttributes<UsersViewMethods>
  >
>;

export interface UsersViewProps {
  onDeselect?: (userProfile: UserProfile) => void;
  onSelect: (userProfile: UserProfile) => void;
  selected: UserProfile[];
  userProfiles: UserProfile[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UsersViewMethods {}
