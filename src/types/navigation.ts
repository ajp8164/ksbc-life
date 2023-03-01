import { ContentView } from 'types/content';
import { NavigatorScreenParams } from '@react-navigation/core';

export enum StartupScreen {
  None = 'None',
  Home = 'Home',
  Welcome = 'Welcome',
}

export type GivingNavigatorParamList = {
  Giving: undefined;
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

export type ServicesNavigatorParamList = {
  Services: undefined;
};

export type StartupNavigatorParamList = {
  Welcome: undefined;
};

export type TabNavigatorParamList = {
  GivingTab: undefined;
  HomeTab: undefined;
  MoreTab: undefined;
  ServicesTab: undefined;
};
