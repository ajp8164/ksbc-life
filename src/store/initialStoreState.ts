import {
  AppSettingsState,
  initialAppSettingsState,
} from 'store/slices/appSettings';
import { AppState, initialAppState } from 'store/slices/app';
import {
  NetworkStatusState,
  initialNetworkStatusState,
} from 'store/slices/networkStatus';
import { UserState, initialUserState } from 'store/slices/user';
import { VideosState, initialVideosState } from 'store/slices/videos';

export interface StoreState {
  app: AppState;
  appSettings: AppSettingsState;
  networkStatus: NetworkStatusState;
  user: UserState;
  videos: VideosState;
}

export const initialStoreState = Object.freeze<StoreState>({
  app: initialAppState,
  appSettings: initialAppSettingsState,
  networkStatus: initialNetworkStatusState,
  user: initialUserState,
  videos: initialVideosState,
});
