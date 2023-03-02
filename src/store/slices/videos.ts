import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit';

import { DateTime } from 'luxon';
import { revertAll } from 'store/actions';

export interface VideosState {
  sermons: {
    collection: GoogleApiYouTubeSearchResource[];
    lastUpdated: string | undefined;
  };
}

export const initialVideosState = Object.freeze<VideosState>({
  sermons: {
    collection: [],
    lastUpdated: undefined,
  },
});

const handleSaveSermonVideos: CaseReducer<
  VideosState,
  PayloadAction<{ videos: GoogleApiYouTubeSearchResource[] }>
> = (state, { payload }) => {
  return {
    ...state,
    sermons: {
      collection: payload.videos,
      lastUpdated: DateTime.now().toISO(),
    },
  };
};

const videosSlice = createSlice({
  name: 'videos',
  initialState: initialVideosState,
  extraReducers: builder =>
    builder.addCase(revertAll, () => initialVideosState),
  reducers: {
    saveSermonVideos: handleSaveSermonVideos,
  },
});

export const videosReducer = videosSlice.reducer;
export const saveSermonVideos = videosSlice.actions.saveSermonVideos;
