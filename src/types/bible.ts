export type BibleReference = {
  book: string;
  chapter: string;
  verse: {
    start: string;
    end: string;
  };
};
