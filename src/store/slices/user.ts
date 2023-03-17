import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User, UserProfile } from 'types/user';

import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { revertAll } from 'store/actions';

export interface UserState {
  credentials: FirebaseAuthTypes.User | null | undefined;
  profile: UserProfile | undefined;
}

export const initialUserState = Object.freeze<UserState>({
  credentials: undefined,
  profile: undefined,
});

const handleSaveUser: CaseReducer<UserState, PayloadAction<{ user: User }>> = (
  state,
  { payload },
) => {
  return {
    ...state,
    credentials: payload.user.credentials,
    profile: payload.user.profile,
  };
};

const handleUpdateUserProfile: CaseReducer<
  UserState,
  PayloadAction<{ userProfile: UserProfile }>
> = (state, { payload }) => {
  return {
    ...state,
    profile: {
      ...state.profile,
      ...payload.userProfile,
    },
  };
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  extraReducers: builder => builder.addCase(revertAll, () => initialUserState),
  reducers: {
    saveUser: handleSaveUser,
    updateUserProfile: handleUpdateUserProfile,
  },
});

export const userReducer = userSlice.reducer;
export const saveUser = userSlice.actions.saveUser;
export const updateUserProfile = userSlice.actions.updateUserProfile;
