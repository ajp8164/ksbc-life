import { StoreState } from 'store/initialStoreState';
import { createSelector } from '@reduxjs/toolkit';

export const selectAppState = (state: StoreState): StoreState => state;

export const selectSermon = (id: string) =>
  createSelector(selectAppState, appState => {
    return appState.admin.sermons.find(s => {
      return s.id === id;
    });
  });

export const selectSermons = createSelector(selectAppState, appState => {
  return appState.admin.sermons;
});
