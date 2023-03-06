export type BibleVerse = {
  book: string;
  chapter: string;
  verse: {
    start: string;
    end: string;
  };
};
