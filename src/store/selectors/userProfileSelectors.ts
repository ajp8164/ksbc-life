import { StoreState } from 'store/initialStoreState';
import { createSelector } from '@reduxjs/toolkit';

export const selectAppState = (state: StoreState): StoreState => state;

export const selectUserProfile = createSelector(selectAppState, appState => {
  return appState.userProfile;
});

export const selectUser = createSelector(selectAppState, appState => {
  return appState.userProfile?.user;
});
