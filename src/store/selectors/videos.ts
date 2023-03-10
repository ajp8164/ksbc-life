import { StoreState } from 'store/initialStoreState';
import { createSelector } from '@reduxjs/toolkit';

export const selectAppState = (state: StoreState): StoreState => state;

export const selectSermonVideo = (videoId: string) =>
  createSelector(selectAppState, appState => {
    return appState.admin.sermons.find(s => {
      return s.videoId === videoId;
    });
  });

export const selectSermonVideos = createSelector(selectAppState, appState => {
  return appState.videos.sermons.collection;
});

export const selectSermonVideosLastUpdated = createSelector(
  selectAppState,
  appState => {
    return appState.videos.sermons.lastUpdated;
  },
);
