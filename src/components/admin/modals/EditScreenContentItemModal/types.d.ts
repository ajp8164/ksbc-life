import { EditorState as ContentEditorState } from 'components/admin/views/ScreenContentItemContentEditorView';
import React from 'react';
import { EditorState as ScheduleEditorState } from 'components/admin/views/ScreenContentItemScheduleEditorView';
import { ScreenContentItem } from 'types/screenContentItem';

export declare type EditScreenContentItemModal =
  EditScreenContentItemModalMethods;

declare const ScreenContentItemModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    EditScreenContentItemModalProps &
      React.RefAttributes<EditScreenContentItemModalMethods>
  >
>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EditScreenContentItemModalProps {}

export interface EditScreenContentItemModalMethods {
  dismiss: () => void;
  present: (title: string, screenContentItem?: ScreenContentItem) => void;
}

export type EditorState = ContentEditorState & ScheduleEditorState;
