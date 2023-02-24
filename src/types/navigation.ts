import { ContentView } from 'types/content';
import { NavigatorScreenParams } from '@react-navigation/core';

export enum StartupScreen {
  None = 'None',
  Home = 'Home',
  Welcome = 'Welcome',
}

export type AccountNavigatorParamList = {
  About: undefined;
  Account: undefined;
  AppSettings: undefined;
  Content: {
    content: ContentView;
  };
};

export type MainNavigatorParamList = {
  Startup: NavigatorScreenParams<StartupNavigatorParamList>;
  Tabs: NavigatorScreenParams<TabNavigatorParamList>;
};

export type HomeNavigatorParamList = {
  Home: undefined;
};

export type StartupNavigatorParamList = {
  Welcome: undefined;
};

export type TabNavigatorParamList = {
  AccountTab: undefined;
  HomeTab: undefined;
};
