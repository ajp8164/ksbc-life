import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface AppState {
  storageSchemaVersion: number;
}

export const initialAppState = Object.freeze<AppState>({
  storageSchemaVersion: 0,
});

const handleSaveSchemaVersion: CaseReducer<
  AppState,
  PayloadAction<{ version: number }>
> = (state, { payload }) => {
  return {
    ...state,
    storageSchemaVersion: payload.version,
  };
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    saveSchemaVersion: handleSaveSchemaVersion,
  },
});

export const appReducer = appSlice.reducer;
export const saveSchemaVersion = appSlice.actions.saveSchemaVersion;
