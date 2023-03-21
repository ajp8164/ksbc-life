import { ContentView } from 'types/content';
import { NavigatorScreenParams } from '@react-navigation/core';
import { Sermon } from 'types/sermon';

export enum StartupScreen {
  None = 'None',
  Home = 'Home',
  Welcome = 'Welcome',
}

export type GivingNavigatorParamList = {
  Giving: undefined;
  GivingBrowser: undefined;
};

export type MoreNavigatorParamList = {
  About: undefined;
  AdminChurch: undefined;
  AdminContent: undefined;
  AdminHome: undefined;
  AdminNotifications: undefined;
  AdminPasteurs: undefined;
  AdminSermons: undefined;
  AdminSermonVideos: undefined;
  AdminUsers: undefined;
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
    sermon: Sermon;
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
};
