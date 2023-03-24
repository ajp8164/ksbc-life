import React from 'react';
import { ScreenContentItem } from 'types/screenContentItem';

export declare type ScreenContentItemEditorView =
  ScreenContentItemEditorViewMethods;

declare const ScreenContentItemEditorView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    ScreenContentItemEditorViewProps &
      React.RefAttributes<ScreenContentItemEditorViewMethods>
  >
>;

export interface ScreenContentItemEditorViewProps {
  contentContainerHeight?: number;
  onChange?: (editorState: EditorState) => void;
  screenContentItem?: ScreenContentItem;
}

export interface ScreenContentItemEditorViewMethods {
  saveScreenContentItem: () => Promise<void>;
}

export type EditorState = {
  fieldCount: number;
  focusedField?: number;
  isSubmitting: boolean;
  changed: boolean;
};
