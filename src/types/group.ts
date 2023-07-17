import { UserProfile } from 'types/user';

export type GroupNameSize = 'short' | 'long';

export type Group = {
  id?: string;
  createdBy: string;
  createdAt?: number;
  updatedAt?: number;
  name: string;
  type: 'public' | 'private';
  members: string[];
  leaders: string[];
  photoUrl: string;
  avatar: {
    color: string;
    title: string;
  };
  isTyping?: { [key in string]: string }[];
  latestMessageSnippet?: {
    createdBy: string;
    createdAt: string;
    text: string;
    //List of group member ids that have read this message
    readBy: string[];
  };
};

export type ExtendedGroup = Group & {
  extended?: {
    calculatedName?: string;
    groupUserProfiles?: UserProfile[];
  };
};
