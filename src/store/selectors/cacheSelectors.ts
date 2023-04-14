import { StoreState } from 'store/initialStoreState';
import { createSelector } from '@reduxjs/toolkit';

export const selectAppState = (state: StoreState): StoreState => state;

export const selectUserProfilesCache = createSelector(
  selectAppState,
  appState => {
    return appState.cache.userProfiles;
  },
);
