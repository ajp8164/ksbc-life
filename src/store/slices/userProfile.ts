import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit';

import { revertAll } from 'store/actions';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export interface UserProfileState {
  user: FirebaseAuthTypes.User | null | undefined;
}

export const initialUserProfileState = Object.freeze<UserProfileState>({
  user: undefined,
});

const handleSaveUser: CaseReducer<
  UserProfileState,
  PayloadAction<{ user: FirebaseAuthTypes.User }>
> = (state, { payload }) => {
  return {
    ...state,
    user: payload.user,
  };
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: initialUserProfileState,
  extraReducers: builder =>
    builder.addCase(revertAll, () => initialUserProfileState),
  reducers: {
    saveUser: handleSaveUser,
  },
});

export const userProfileReducer = userProfileSlice.reducer;
export const saveUser = userProfileSlice.actions.saveUser;
