import { BibleReference } from 'types/bible';
import { ISODateString } from './common';

export type Sermon = {
  id: string;
  date: ISODateString;
  title: string;
  pasteur: string;
  seriesTitle: string;
  bibleReference: BibleReference | undefined;
  videoId: string;
  lifeApplication: {
    title: string;
    items: string[];
  };
};

export type SermonVideo = GoogleApiYouTubeSearchResource;
