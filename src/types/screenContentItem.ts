import { TextStyle, ViewStyle } from 'react-native';

import { ISODateString } from 'types/common';

type ScreenContentItemKind = 'card';

type ScreenContentSchedule = {
  enabled: boolean;
  startDate: ISODateString;
  endDate: ISODateString;
};

export type ScreenContentItem = {
  id?: string;
  name: string;
  kind: ScreenContentItemKind;
  ordinal: number;
  content: ScreenCardContentItem;
  schedule: ScreenContentSchedule;
  status: 'active' | 'archive';
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
