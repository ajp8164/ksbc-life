import React from 'react';
import { ScreenContentItem } from 'types/screenContentItem';
import { ViewStyle } from 'react-native';

export declare type ScreenContentItemScheduleEditorView =
  ScreenContentItemScheduleViewEditorMethods;

declare const ScreenContentItemScheduleEditorView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    ScreenContentItemScheduleEditorViewProps &
      React.RefAttributes<ScreenContentItemScheduleEditorViewMethods>
  >
>;

export interface ScreenContentItemScheduleEditorViewProps {
  containerStyle?: ViewStyle | ViewStyle[];
  onChange?: (editorState: EditorState) => void;
  screenContentItem?: ScreenContentItem;
}

export interface ScreenContentItemScheduleEditorViewMethods {
  saveScreenContentItem: () => Promise<void>;
}

export type EditorState = {
  fieldCount: number;
  focusedField?: number;
  isSubmitting: boolean;
  changed: boolean;
};
