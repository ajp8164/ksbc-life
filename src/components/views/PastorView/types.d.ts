import { Pastor } from 'types/church';
import React from 'react';

export declare type PastorView = PastorViewMethods;

declare const PastorView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    PastorViewProps & React.RefAttributes<PastorViewMethods>
  >
>;

export interface PastorViewProps {
  pastor: Pastor;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PastorViewMethods {}
