import {
  AppSettingsState,
  initialAppSettingsState,
} from 'store/slices/appSettings';
import { AppState, initialAppState } from 'store/slices/app';
import { CacheState, initialCacheState } from 'store/slices/cache';
import {
  NetworkStatusState,
  initialNetworkStatusState,
} from 'store/slices/networkStatus';
import { UserState, initialUserState } from 'store/slices/user';

export interface StoreState {
  app: AppState;
  appSettings: AppSettingsState;
  cache: CacheState;
  networkStatus: NetworkStatusState;
  user: UserState;
}

export const initialStoreState = Object.freeze<StoreState>({
  app: initialAppState,
  appSettings: initialAppSettingsState,
  cache: initialCacheState,
  networkStatus: initialNetworkStatusState,
  user: initialUserState,
});
