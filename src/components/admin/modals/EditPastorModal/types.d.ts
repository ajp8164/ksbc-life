import { Pastor } from 'types';
import React from 'react';

export declare type EditPastorModal = EditPastorModalMethods;

declare const PastorModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    EditPastorModalProps & React.RefAttributes<EditPastorModalMethods>
  >
>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EditPastorModalProps {}

export interface EditPastorModalMethods {
  dismiss: () => void;
  present: (title: string, pastor?: Pastor) => void;
}
