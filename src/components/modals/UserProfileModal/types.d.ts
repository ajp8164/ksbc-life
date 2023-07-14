import React from 'react';

export declare type UserProfileModal = UserProfileModalMethods;

declare const LegalModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    UserProfileModalProps & React.RefAttributes<UserProfileModalMethods>
  >
>;

export interface UserProfileModalProps {
  userProfile?: UserProfile;
  snapPoints?: (string | number)[];
}

export interface UserProfileModalMethods {
  dismiss: () => void;
  present: (userProfile?: UserProfile) => void;
}
