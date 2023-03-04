import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Sermon } from 'types/admin';
import { revertAll } from 'store/actions';

export interface AdminState {
  sermons: Sermon[];
}

export const initialAdminState = Object.freeze<AdminState>({
  // sermons: [],
  sermons: [
    {
      id: '0',
      date: 'Mar 3, 2023',
      title: 'Spring Cleaning',
    },
    {
      id: '1',
      date: 'Mar 10, 2023',
      title: 'Be Patient',
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
