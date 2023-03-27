import { PageContentItem } from 'types/pageContentItem';
import React from 'react';

export declare type EditPageContentItemModal = EditPageContentItemModalMethods;

declare const PageContentItemModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    EditPageContentItemModalProps &
      React.RefAttributes<EditPageContentItemModalMethods>
  >
>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EditPageContentItemModalProps {}

export interface EditPageContentItemModalMethods {
  dismiss: () => void;
  present: (title: string, pageContentItem?: PageContentItem) => void;
}
