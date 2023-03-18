import { Church } from 'types/church';
import React from 'react';

export declare type ChurchEditorView = ChurchEditorViewMethods;

declare const ChurchEditorView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    ChurchEditorViewProps & React.RefAttributes<ChurchEditorViewMethods>
  >
>;

export interface ChurchEditorViewProps {
  church?: Church;
  onChange?: (editorState: EditorState) => void;
}

export interface ChurchEditorViewMethods {
  saveChurch: () => Promise<void>;
}

export interface EditorState {
  fieldCount: number;
  focusedField?: number;
  isSubmitting: boolean;
  changed: boolean;
}
