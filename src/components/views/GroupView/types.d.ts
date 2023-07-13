import { Group } from 'types/group';
import React from 'react';

export declare type GroupView = GroupViewMethods;

declare const GroupView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    GroupViewProps & React.RefAttributes<GroupViewMethods>
  >
>;

export interface GroupViewProps {
  group: Group;
  onEditorStateChange?: (editorState: EditorState) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GroupViewMethods {}

export interface EditorState {
  isSubmitting: boolean;
}
