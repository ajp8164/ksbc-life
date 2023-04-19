import { ContentView } from 'types/content';
import { Group } from 'types/group';
import { NavigatorScreenParams } from '@react-navigation/core';
import { PageContentItemAssignment } from 'types/pageContentItem';
import { Sermon } from 'types/sermon';

export enum StartupScreen {
  None = 'None',
  Home = 'Home',
  Welcome = 'Welcome',
}

export type ChatNavigatorParamList = {
  ChatGroup: {
    group?: Group;
  };
  ChatGroupList: undefined;
};

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
  AdminPageContent: {
    pageName: PageContentItemAssignment;
  };
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
  ChatTab: undefined;
  GivingTab: undefined;
  HomeTab: undefined;
  MoreTab: {
    screen: string;
    params: object;
  };
  SermonsTab: undefined;
};
