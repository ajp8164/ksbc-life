import React from 'react';
import { Sermon } from 'types/church';

export declare type SermonEditorView = SermonEditorViewMethods;

declare const SermonEditorView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    SermonEditorViewProps & React.RefAttributes<SermonEditorViewMethods>
  >
>;

export interface SermonEditorViewProps {
  onChange?: (editorState: EditorState) => void;
  sermon?: Sermon;
}

export interface SermonEditorViewMethods {
  saveSermon: () => Promise<void>;
}

export interface EditorState {
  fieldCount: number;
  focusedField?: number;
  isSubmitting: boolean;
  changed: boolean;
}
