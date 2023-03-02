import {
  AppSettingsState,
  initialAppSettingsState,
} from 'store/slices/appSettings';
import { AppState, initialAppState } from 'store/slices/app';
import {
  NetworkStatusState,
  initialNetworkStatusState,
} from 'store/slices/networkStatus';
import {
  UserProfileState,
  initialUserProfileState,
} from 'store/slices/userProfile';
import { VideosState, initialVideosState } from 'store/slices/videos';

export interface StoreState {
  app: AppState;
  appSettings: AppSettingsState;
  networkStatus: NetworkStatusState;
  userProfile: UserProfileState;
  videos: VideosState;
}

export const initialStoreState = Object.freeze<StoreState>({
  app: initialAppState,
  appSettings: initialAppSettingsState,
  networkStatus: initialNetworkStatusState,
  userProfile: initialUserProfileState,
  videos: initialVideosState,
});
