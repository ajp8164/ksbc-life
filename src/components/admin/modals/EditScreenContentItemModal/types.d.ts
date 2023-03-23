import { ScreenContentItem } from 'types/screenContentItem';
import React from 'react';

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
