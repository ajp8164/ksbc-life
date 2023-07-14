import React from 'react';
import { UserProfile } from 'types/user';

export declare type UserProfileView = UserProfileViewMethods;

declare const UserProfileView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    UserProfileViewProps & React.RefAttributes<UserProfileViewMethods>
  >
>;

export interface UserProfileViewProps {
  userProfile: UserProfile;
  onEditorStateChange?: (editorState: EditorState) => void;
  style?: 'modal' | 'screen';
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserProfileViewMethods {}

export interface EditorState {
  isSubmitting: boolean;
}
