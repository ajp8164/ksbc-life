import React from 'react';

export declare type SermonEditorView = SermonEditorViewMethods;

declare const TextView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    SermonEditorViewProps & React.RefAttributes<SermonEditorViewMethods>
  >
>;

export interface SermonEditorViewProps {
  onChange?: (editorState: EditorState) => void;
}

export interface SermonEditorViewMethods {
  saveSermon: () => Promise<void>;
}

export interface EditorState {
  fieldCount: number;
  focusedField?: number;
  isSubmitting: boolean;
  isValid: boolean;
}
