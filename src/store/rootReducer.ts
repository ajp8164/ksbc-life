import { adminReducer } from 'store/slices/admin';
import { appReducer } from 'store/slices/app';
import { appSettingsReducer } from 'store/slices/appSettings';
import { combineReducers } from '@reduxjs/toolkit';
import { networkStatusReducer } from 'store/slices/networkStatus';
import { userReducer } from 'store/slices/user';
import { videosReducer } from 'store/slices/videos';

export const rootReducer = combineReducers({
  admin: adminReducer,
  app: appReducer,
  appSettings: appSettingsReducer,
  networkStatus: networkStatusReducer,
  user: userReducer,
  videos: videosReducer,
});
