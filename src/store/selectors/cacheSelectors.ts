import { StoreState } from 'store/initialStoreState';
import { createSelector } from '@reduxjs/toolkit';

export const selectAppState = (state: StoreState): StoreState => state;

export const selectGroupsCache = createSelector(selectAppState, appState => {
  return appState.cache.groups;
});

export const selectUserProfilesCache = createSelector(
  selectAppState,
  appState => {
    return appState.cache.userProfiles;
  },
);
