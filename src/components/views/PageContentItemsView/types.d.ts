import { PageContentItem } from 'types';
import React from 'react';

export declare type PageContentItemsView = PageContentItemsViewMethods;

declare const PageContentItemsView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    PageContentItemsViewProps & React.RefAttributes<PageContentItemsViewMethods>
  >
>;

export interface PageContentItemsViewProps {
  items: PageContentItem[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PageContentItemsViewMethods {}
