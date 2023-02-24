import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ThemeSettings } from 'types/theme';
import { Tou } from 'types/tou';
import { revertAll } from 'store/actions';

export interface AppSettingsState {
  biometrics: boolean;
  themeSettings: ThemeSettings;
  tou: Tou;
}

export const initialAppSettingsState = Object.freeze<AppSettingsState>({
  biometrics: true,
  themeSettings: {
    followDevice: true,
    app: 'light',
  },
  tou: {
    accepted: undefined,
  },
});

const handleSaveBiometrics: CaseReducer<
  AppSettingsState,
  PayloadAction<{ value: boolean }>
> = (state, { payload }) => {
  return {
    ...state,
    biometrics: payload.value,
  };
};

const handleSaveThemeSettings: CaseReducer<
  AppSettingsState,
  PayloadAction<{ themeSettings: ThemeSettings }>
> = (state, { payload }) => {
  return {
    ...state,
    themeSettings: payload.themeSettings,
  };
};

const handleSaveAcceptTou: CaseReducer<
  AppSettingsState,
  PayloadAction<{ tou: Tou }>
> = (state, { payload }) => {
  return {
    ...state,
    tou: payload.tou,
  };
};

const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState: initialAppSettingsState,
  extraReducers: builder =>
    builder.addCase(revertAll, () => initialAppSettingsState),
  reducers: {
    saveAcceptTou: handleSaveAcceptTou,
    saveBiometrics: handleSaveBiometrics,
    saveThemeSettings: handleSaveThemeSettings,
  },
});

export const appSettingsReducer = appSettingsSlice.reducer;
export const saveAcceptTou = appSettingsSlice.actions.saveAcceptTou;
export const saveBiometrics = appSettingsSlice.actions.saveBiometrics;
export const saveThemeSettings = appSettingsSlice.actions.saveThemeSettings;
