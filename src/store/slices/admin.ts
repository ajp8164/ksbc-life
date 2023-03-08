import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit';

import { BibleVerse } from 'types/bible';
import { Sermon } from 'types/church';
import { revertAll } from 'store/actions';

export interface AdminState {
  sermons: Sermon[];
}

export const initialAdminState = Object.freeze<AdminState>({
  // sermons: [],
  sermons: [
    {
      date: 'Mar 3, 2023',
      title: 'Spring Cleaning',
      pasteur: '',
      seriesTitle: '',
      bibleRef: {} as BibleVerse,
      videoId: '',
      applicationTitle: '',
      application1: '',
      application2: '',
      application3: '',
      application4: '',
      application5: '',
    },
    {
      date: 'Mar 10, 2023',
      title: 'Be Patient',
      pasteur: '',
      seriesTitle: '',
      bibleRef: {} as BibleVerse,
      videoId: '',
      applicationTitle: '',
      application1: '',
      application2: '',
      application3: '',
      application4: '',
      application5: '',
    },
  ],
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
