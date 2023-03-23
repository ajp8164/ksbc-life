import React from 'react';
import { ScreenContentItem } from 'types/screenContentItem';
import { ViewStyle } from 'react-native';

export declare type ScreenContentItemContentEditorView =
  ScreenContentItemContentEditorViewMethods;

declare const ScreenContentItemEditorView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    ScreenContentItemContentEditorViewProps &
      React.RefAttributes<ScreenContentItemContentEditorViewMethods>
  >
>;

export interface ScreenContentItemContentEditorViewProps {
  containerStyle?: ViewStyle | ViewStyle[];
  onChange?: (editorState: EditorState) => void;
  screenContentItem?: ScreenContentItem;
}

export interface ScreenContentItemContentEditorViewMethods {
  saveScreenContentItem: () => Promise<void>;
}

export type EditorState = {
  fieldCount: number;
  focusedField?: number;
  isSubmitting: boolean;
  changed: boolean;
};
