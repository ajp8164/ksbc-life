import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit';

import { UserProfile } from 'types/user';
import { revertAll } from 'store/actions';

export interface CacheState {
  userProfiles: UserProfile[];
}

export const initialCacheState = Object.freeze<CacheState>({
  userProfiles: [],
});

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
  extraReducers: builder => builder.addCase(revertAll, () => initialCacheState),
  reducers: {
    cacheUserProfiles: handleCacheUserProfiles,
  },
});

export const cacheReducer = cacheSlice.reducer;
export const cacheUserProfiles = cacheSlice.actions.cacheUserProfiles;
