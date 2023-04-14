import { Group } from 'types/group';
import React from 'react';

export declare type GroupEditorView = GroupEditorViewMethods;

declare const GroupEditorView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    GroupEditorViewProps & React.RefAttributes<GroupEditorViewMethods>
  >
>;

export interface GroupEditorViewProps {
  onEditorStateChange?: (editorState: EditorState) => void;
  group: Group;
}

export interface GroupEditorViewMethods {
  saveGroup: () => Promise<void>;
}

export interface EditorState {
  fieldCount: number;
  focusedField?: number;
  isSubmitting: boolean;
  changed: boolean;
}
