import { TextStyle, ViewStyle } from 'react-native';
import { ImageSource } from 'react-native-vector-icons/Icon';
import { ISODateString } from 'types/common';

type ScreenContentItemKind = 'card';

type ScreenContentSchedule = {
  startDate: ISODateString;
  endDate: ISODateString;
};

export type ScreenContentItem = {
  id?: string;
  kind: ScreenContentItemKind;
  content: ScreenCardContentItem;
  schedule: ScreenContentSchedule;
};

export type ScreenCardContentItem = {
  body?: string;
  bodyStyle?: TextStyle | TextStyle[];
  buttons?: {
    label?: string;
    icon?: string;
    iconType?: string;
  }[];
  cardStyle?: ViewStyle | ViewStyle[];
  footer?: string;
  footerStyle?: TextStyle | TextStyle[];
  header?: string;
  headerStyle?: TextStyle | TextStyle[];
  imageSource?: ImageSource;
  title?: string;
  titleStyle?: TextStyle | TextStyle[];
};
