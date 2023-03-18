import { BibleReference } from 'types/bible';
import { ISODateString } from './common';

export type Church = {
  name: string;
  shortName: string;
  values: string;
  beliefs: string;
};

export type LifeApplication = {
  title: string;
  items: string[];
};

export type Sermon = {
  id?: string;
  date: ISODateString;
  title: string;
  pasteur: string;
  seriesTitle?: string;
  bibleReference?: BibleReference;
  videoId?: string;
  lifeApplication?: LifeApplication;
};

export type SermonVideo = GoogleApiYouTubeSearchResource;
