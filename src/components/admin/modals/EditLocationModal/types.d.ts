import { Location } from 'types/location';
import React from 'react';

export declare type EditLocationModal = EditLocationModalMethods;

declare const LocationModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    EditLocationModalProps & React.RefAttributes<EditLocationModalMethods>
  >
>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EditLocationModalProps {}

export interface EditLocationModalMethods {
  dismiss: () => void;
  present: (title: string, location?: Location) => void;
}
