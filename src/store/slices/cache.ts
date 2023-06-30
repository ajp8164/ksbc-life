import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Group } from 'types/group';
import { UserProfile } from 'types/user';

export interface CacheState {
  groups: Group[];
  userProfiles: UserProfile[];
}

export const initialCacheState = Object.freeze<CacheState>({
  groups: [],
  userProfiles: [],
});

const handleCacheGroups: CaseReducer<
  CacheState,
  PayloadAction<{ groups: Group[] }>
> = (state, { payload }) => {
  return {
    ...state,
    groups: payload.groups,
  };
};
const handleCacheUserProfiles: CaseReducer<
  CacheState,
  PayloadAction<{ userProfiles: UserProfile[] }>
> = (state, { payload }) => {
  return {
    ...state,
    userProfiles: payload.userProfiles,
  };
};

const cacheSlice = createSlice({
  name: 'cache',
  initialState: initialCacheState,
  // Not adding revertAll extra reducer. The cache should survive a user
  // switch since it's independent of who is signed in.
  reducers: {
    cacheGroups: handleCacheGroups,
    cacheUserProfiles: handleCacheUserProfiles,
  },
});

export const cacheReducer = cacheSlice.reducer;
export const cacheGroups = cacheSlice.actions.cacheGroups;
export const cacheUserProfiles = cacheSlice.actions.cacheUserProfiles;
