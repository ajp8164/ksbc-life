import { EditorState } from 'components/admin/views/ScreenContentItemEditorView';
import React from 'react';
import { ScreenContentItem } from 'types/screenContentItem';
import { ViewStyle } from 'react-native';

export declare type ScreenContentItemEditorView =
  ScreenContentItemEditorViewMethods;

declare const ScreenContentItemView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    ScreenContentItemEditorViewProps &
      React.RefAttributes<ScreenContentItemEditorViewMethods>
  >
>;

export interface ScreenContentItemEditorViewProps {
  contentContainerStyle?: ViewStyle | ViewStyle[];
  onChange?: (editorState: EditorState) => void;
  screenContentItem?: ScreenContentItem;
}

export interface ScreenContentItemEditorViewMethods {
  saveScreenContentItem: () => Promise<void>;
}
