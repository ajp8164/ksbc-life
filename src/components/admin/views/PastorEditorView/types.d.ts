import { Pastor } from 'types/pastor';
import React from 'react';

export declare type PastorEditorView = PastorEditorViewMethods;

declare const PastorEditorView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    PastorEditorViewProps & React.RefAttributes<PastorEditorViewMethods>
  >
>;

export interface PastorEditorViewProps {
  onEditorStateChange?: (editorState: EditorState) => void;
  pastor?: Pastor;
}

export interface PastorEditorViewMethods {
  savePastor: () => Promise<void>;
}

export interface EditorState {
  fieldCount: number;
  focusedField?: number;
  isSubmitting: boolean;
  changed: boolean;
}
