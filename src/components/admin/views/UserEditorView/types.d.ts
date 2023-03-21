import React from 'react';
import { UserProfile } from 'types/user';

export declare type UserEditorView = UserEditorViewMethods;

declare const UserEditorView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    UserEditorViewProps & React.RefAttributes<UserEditorViewMethods>
  >
>;

export interface UserEditorViewProps {
  onChange?: (editorState: EditorState) => void;
  user?: UserProfile;
}

export interface UserEditorViewMethods {
  saveUser: () => Promise<void>;
}

export interface EditorState {
  isSubmitting: boolean;
  changed: boolean;
}
