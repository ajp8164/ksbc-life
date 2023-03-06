import { ISODateString } from './common';

export type Sermon = {
  id: string;
  date: ISODateString;
  title: string;
  pasteur: string;
  seriesTitle: string;
  bibleRef: string;
  videoId: string;
  applicationTitle: string;
  application1: string;
  application2: string;
  application3: string;
  application4: string;
  application5: string;
};
