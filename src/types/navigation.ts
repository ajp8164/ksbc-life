import { Pasteur, Sermon } from 'types/church';

import { ContentView } from 'types/content';
import { NavigatorScreenParams } from '@react-navigation/core';

export enum StartupScreen {
  None = 'None',
  Home = 'Home',
  Welcome = 'Welcome',
}

export type AdminNavigatorParamList = {
  AdminHome: undefined;
  AdminPasteur: {
    pasteur: Pasteur;
  };
  AdminPasteursList: undefined;
  AdminSermon: {
    sermon: Sermon;
  };
  AdminSermonsList: undefined;
};

export type GivingNavigatorParamList = {
  Giving: undefined;
  GivingBrowser: undefined;
};

export type MoreNavigatorParamList = {
  About: undefined;
  AppSettings: undefined;
  Content: {
    content: ContentView;
  };
  More: {
    subNav?: string;
  };
  UserProfile: undefined;
};

export type MainNavigatorParamList = {
  Startup: NavigatorScreenParams<StartupNavigatorParamList>;
  Tabs: NavigatorScreenParams<TabNavigatorParamList>;
};

export type HomeNavigatorParamList = {
  Home: undefined;
};

export type SermonsNavigatorParamList = {
  Sermons: undefined;
  SermonDetail: {
    id: string;
  };
};

export type StartupNavigatorParamList = {
  Welcome: undefined;
};

export type TabNavigatorParamList = {
  GivingTab: undefined;
  HomeTab: undefined;
  MoreTab: undefined;
  SermonsTab: undefined;
  // Admin Tabs
  AdminTab: undefined;
};
