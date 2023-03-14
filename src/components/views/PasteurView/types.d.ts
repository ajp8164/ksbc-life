import { Pasteur } from 'types/church';
import React from 'react';

export declare type PasteurView = PasteurViewMethods;

declare const PasteurView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    PasteurViewProps & React.RefAttributes<PasteurViewMethods>
  >
>;

export interface PasteurViewProps {
  pasteur: Pasteur;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PasteurViewMethods {}
