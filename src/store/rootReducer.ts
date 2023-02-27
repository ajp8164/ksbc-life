import { appReducer } from 'store/slices/app';
import { appSettingsReducer } from 'store/slices/appSettings';
import { combineReducers } from '@reduxjs/toolkit';
import { networkStatusReducer } from 'store/slices/networkStatus';
import { userProfileReducer } from 'store/slices/userProfile';

export const rootReducer = combineReducers({
  app: appReducer,
  appSettings: appSettingsReducer,
  networkStatus: networkStatusReducer,
  userProfile: userProfileReducer,
});
