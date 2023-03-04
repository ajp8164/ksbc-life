import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit';

import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { UserRole } from 'types/user';
import { revertAll } from 'store/actions';

export interface UserProfileState {
  roles: UserRole[];
  user: FirebaseAuthTypes.User | null | undefined;
}

export const initialUserProfileState = Object.freeze<UserProfileState>({
  roles: [],
  user: undefined,
});

const handleSaveRoles: CaseReducer<
  UserProfileState,
  PayloadAction<{ roles: UserRole[] }>
> = (state, { payload }) => {
  return {
    ...state,
    roles: payload.roles,
  };
};

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
    saveRoles: handleSaveRoles,
    saveUser: handleSaveUser,
  },
});

export const userProfileReducer = userProfileSlice.reducer;
export const saveRoles = userProfileSlice.actions.saveRoles;
export const saveUser = userProfileSlice.actions.saveUser;
