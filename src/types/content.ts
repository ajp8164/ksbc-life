export type ContentLink = {
  prefix?: string;
  text?: string;
  url?: string;
  suffix?: string;
};

export type ContentItem = {
  link?: ContentLink;
  orderedBullets?: string[];
  text?: string;
  title?: string;
  unorderedBullets?: string[];
};

export type ContentContainer = {
  title?: string;
  items?: ContentItem[];
};

export type ContentView = {
  name: string;
  lists: ContentContainer[][];
};
