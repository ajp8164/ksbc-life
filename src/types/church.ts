import { BibleVerse } from 'types/bible';
import { ISODateString } from './common';

export type Sermon = {
  date: ISODateString;
  title: string;
  pasteur: string;
  seriesTitle: string;
  bibleRef: BibleVerse | undefined;
  videoId: string;
  applicationTitle: string;
  application1: string;
  application2: string;
  application3: string;
  application4: string;
  application5: string;
};
