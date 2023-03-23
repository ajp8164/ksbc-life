import { ScreenContentItem } from 'types/screenContentItem';
import React from 'react';

export declare type ScreenContentItemEditorView =
  ScreenContentItemEditorViewMethods;

declare const ScreenContentItemEditorView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    ScreenContentItemEditorViewProps &
      React.RefAttributes<ScreenContentItemEditorViewMethods>
  >
>;

export interface ScreenContentItemEditorViewProps {
  screenContentItem?: ScreenContentItem;
  onChange?: (editorState: EditorState) => void;
}

export interface ScreenContentItemEditorViewMethods {
  saveScreenContentItem: () => Promise<void>;
}

export interface EditorState {
  fieldCount: number;
  focusedField?: number;
  isSubmitting: boolean;
  changed: boolean;
}
