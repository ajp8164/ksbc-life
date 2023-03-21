import { Pasteur } from 'types/pasteur';
import React from 'react';

export declare type PasteurEditorView = PasteurEditorViewMethods;

declare const PasteurView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    PasteurEditorViewProps & React.RefAttributes<PasteurEditorViewMethods>
  >
>;

export interface PasteurEditorViewProps {
  onEditorStateChange?: (editorState: EditorState) => void;
  pasteur?: Pasteur;
}

export interface PasteurEditorViewMethods {
  savePasteur: () => Promise<void>;
}

export interface EditorState {
  fieldCount: number;
  focusedField?: number;
  isSubmitting: boolean;
  changed: boolean;
}
