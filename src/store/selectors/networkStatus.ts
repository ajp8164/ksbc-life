import { StoreState } from 'store/initialStoreState';
import { createSelector } from '@reduxjs/toolkit';

export const selectAppState = (state: StoreState): StoreState => state;

export const selectNetworkStatus = createSelector(selectAppState, appState => {
  return appState.networkStatus;
});
