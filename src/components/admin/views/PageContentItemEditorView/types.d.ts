import { PageContentItem } from 'types/pageContentItem';
import React from 'react';

export declare type PageContentItemEditorView =
  PageContentItemEditorViewMethods;

declare const PageContentItemEditorView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    PageContentItemEditorViewProps &
      React.RefAttributes<PageContentItemEditorViewMethods>
  >
>;

export interface PageContentItemEditorViewProps {
  contentContainerHeight?: number;
  onChange?: (editorState: EditorState) => void;
  pageContentItem?: PageContentItem;
}

export interface PageContentItemEditorViewMethods {
  savePageContentItem: () => Promise<void>;
}

export type EditorState = {
  fieldCount: number;
  focusedField?: number;
  isSubmitting: boolean;
  changed: boolean;
};
