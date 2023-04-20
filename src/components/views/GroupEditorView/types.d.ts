import { Group } from 'types/group';
import React from 'react';

export declare type GroupEditorView = GroupEditorViewMethods;

declare const GroupEditorView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    GroupEditorViewProps & React.RefAttributes<GroupEditorViewMethods>
  >
>;

export interface GroupEditorViewProps {
  group: Group;
  onEditorStateChange?: (editorState: EditorState) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GroupEditorViewMethods {}

export interface EditorState {
  isSubmitting: boolean;
}
