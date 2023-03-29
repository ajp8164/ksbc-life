import { ISODateString } from 'types/common';

export type PageContentItemKind = 'Card';

export enum PageContentItemAssignment {
  Ministries = 'Ministries',
  Sermons = 'Sermons',
  Giving = 'Giving',
}

export enum PageContentItemImageSize {
  Short = '100',
  Medium = '150',
  Tall = '200',
}

type PageContentSchedule = {
  enabled: boolean;
  startDate: ISODateString;
  endDate: ISODateString;
};

export type PageContentItem = {
  id?: string;
  name: string;
  kind: PageContentItemKind;
  assignment: PageContentItemAssignment;
  ordinal: number;
  content: ScreenCardContentItem;
  schedule: PageContentSchedule;
  status: 'active' | 'archived';
};

export type ScreenCardContentItem = {
  body: string;
  bodyStyle?: string;
  buttons?: {
    label?: string;
    icon?: string;
    iconType?: string;
  }[];
  cardStyle?: string;
  footer: string;
  footerStyle?: string;
  header: string;
  headerStyle?: string;
  imageUrl: string;
  imageSize: PageContentItemImageSize;
  title: string;
  titleStyle?: string;
};
