import { BibleReference } from 'types/bible';
import React from 'react';

export declare type BibleReferencePickerModal =
  BibleReferencePickerModalMethods;

declare const BibleReferenceModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    BibleReferencePickerModalProps &
      React.RefAttributes<BibleReferencePickerModalMethods>
  >
>;

export interface BibleReferencePickerModalProps {
  onDismiss: (bibleReference: BibleReference) => void;
}

export interface BibleReferencePickerModalMethods {
  dismiss: (bibleReference?: BibleReference) => void;
  present: () => void;
}

export type BibleReferencePickerNavigatorParamList = {
  BibleBookChaptersScreen: undefined;
  BibleVersesScreen: {
    book: string;
    chapter: string;
    verseCount: number;
  };
};
