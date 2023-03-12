import { BibleReference } from 'types/bible';
import { ISODateString } from './common';

export type Church = {
  pasteurs: Pasteur[];
  sermons: Sermon[];
};

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

export type Pasteur = {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  biography: string;
  photoUrl: string;
};
