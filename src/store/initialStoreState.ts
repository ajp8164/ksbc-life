import {
  AppSettingsState,
  initialAppSettingsState,
} from 'store/slices/appSettings';
import { AppState, initialAppState } from 'store/slices/app';
import {
  NetworkStatusState,
  initialNetworkStatusState,
} from 'store/slices/networkStatus';

export interface StoreState {
  app: AppState;
  appSettings: AppSettingsState;
  networkStatus: NetworkStatusState;
}

export const initialStoreState = Object.freeze<StoreState>({
  app: initialAppState,
  appSettings: initialAppSettingsState,
  networkStatus: initialNetworkStatusState,
});
