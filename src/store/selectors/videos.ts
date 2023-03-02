import { StoreState } from 'store/initialStoreState';
import { createSelector } from '@reduxjs/toolkit';

export const selectAppState = (state: StoreState): StoreState => state;

export const selectSermonVideos = createSelector(selectAppState, appState => {
  return appState.videos.sermons.collection;
});

export const selectSermonVideosLastUpdated = createSelector(
  selectAppState,
  appState => {
    return appState.videos.sermons.lastUpdated;
  },
);
