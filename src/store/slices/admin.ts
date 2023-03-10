import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Sermon, SermonVideo } from 'types/church';

import { BibleReference } from 'types/bible';
import { revertAll } from 'store/actions';

export interface AdminState {
  sermons: Sermon[];
  sermonVideos: SermonVideo[];
}

export const initialAdminState = Object.freeze<AdminState>({
  // sermons: [],
  sermons: [
    {
      id: '0',
      date: 'Mar 3, 2023',
      title: 'Spring Cleaning',
      pasteur: 'Jamie Auton',
      seriesTitle: 'series title',
      bibleReference: {} as BibleReference,
      lifeApplication: {
        title: 'life application title',
        items: ['application one'],
      },
      videoId: '',
    },
    {
      id: '1',
      date: 'Mar 10, 2023',
      title: 'Be Patient',
      pasteur: 'Mike Metzger',
      seriesTitle: 'series title',
      bibleReference: {} as BibleReference,
      lifeApplication: {
        title: 'life application title',
        items: ['application one', 'application two'],
      },
      videoId: '',
    },
  ],
  // sermonVideos: [],
  sermonVideos: [],
});

const handleSaveSermons: CaseReducer<
  AdminState,
  PayloadAction<{ sermons: Sermon[] }>
> = (state, { payload }) => {
  return {
    ...state,
    sermons: payload.sermons,
  };
};

const adminSlice = createSlice({
  name: 'admin',
  initialState: initialAdminState,
  extraReducers: builder => builder.addCase(revertAll, () => initialAdminState),
  reducers: {
    saveAcceptTou: handleSaveSermons,
  },
});

export const adminReducer = adminSlice.reducer;
export const saveSermons = adminSlice.actions.saveAcceptTou;
