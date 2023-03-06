import React from 'react';

export declare type BibleVersePickerModal = BibleVersePickerModalMethods;

declare const LegalModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    BibleVersePickerModalProps &
      React.RefAttributes<BibleVersePickerModalMethods>
  >
>;

export interface BibleVersePickerModalProps {
  onDismiss: (bibleVerse: BibleVerse) => void;
}

export interface BibleVersePickerModalMethods {
  dismiss: (bibleVerse?: BibleVerse) => void;
  present: () => void;
}

export type BibleVersePickerNavigatorParamList = {
  BibleBookChaptersScreen: undefined;
  BibleVersesScreen: {
    book: string;
    chapter: string;
    verseCount: number;
  };
};

export type BibleVerse = {
  book: string;
  chapter: string;
  verse: {
    start: string;
    end: string;
  };
};
