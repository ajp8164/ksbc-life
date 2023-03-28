import { TextStyle, ViewStyle } from 'react-native';

import { ISODateString } from 'types/common';

export type PageContentItemKind = 'Card';

export enum PageContentItemAssignment {
  Ministries = 'Ministries',
  Sermons = 'Sermons',
  Giving = 'Giving',
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
  bodyStyle?: TextStyle | TextStyle[];
  buttons?: {
    label?: string;
    icon?: string;
    iconType?: string;
  }[];
  cardStyle?: ViewStyle | ViewStyle[];
  footer: string;
  footerStyle?: TextStyle | TextStyle[];
  header: string;
  headerStyle?: TextStyle | TextStyle[];
  photoUrl: string;
  title: string;
  titleStyle?: TextStyle | TextStyle[];
};
