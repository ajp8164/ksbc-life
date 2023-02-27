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

export interface StoreState {
  app: AppState;
  appSettings: AppSettingsState;
  networkStatus: NetworkStatusState;
  userProfile: UserProfileState;
}

export const initialStoreState = Object.freeze<StoreState>({
  app: initialAppState,
  appSettings: initialAppSettingsState,
  networkStatus: initialNetworkStatusState,
  userProfile: initialUserProfileState,
});
