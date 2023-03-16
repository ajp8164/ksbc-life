import React from 'react';
import { Sermon } from 'types/church';

export declare type EditSermonModal = EditSermonModalMethods;

declare const SermonModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    EditSermonModalProps & React.RefAttributes<EditSermonModalMethods>
  >
>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EditSermonModalProps {}

export interface EditSermonModalMethods {
  dismiss: () => void;
  present: (title: string, sermon?: Sermon) => void;
}
