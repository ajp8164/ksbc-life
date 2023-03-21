import { BibleReference } from 'types/bible';

export const bibleReferenceToString = (
  bibleReference?: BibleReference,
): string => {
  if (bibleReference && bibleReference.book) {
    return bibleReference.verse.end.length > 0
      ? `${bibleReference.book} ${bibleReference.chapter}:${bibleReference.verse.start}-${bibleReference.verse.end}`
      : `${bibleReference.book} ${bibleReference.chapter}:${bibleReference.verse.start}`;
  }
  return '';
};
