import { ThemeMode } from '@rneui/themed';

export type ThemeTarget = 'device' | 'app';

export type ThemeSettings = {
  followDevice: boolean;
  app: ThemeMode;
};
