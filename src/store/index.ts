import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from 'store/rootReducer';

// redux-persist is pushing a function into a reducer (not best practice)
// it has insisted not to fix the issue, but toolkit has an escape-hatch:
// we tell toolkit to ignore serializable inspection on redux-persist actions
// https://github.com/rt2zz/redux-persist/issues/988
const ignoredActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['app', 'appSettings', 'networkStatus', 'userProfile'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: { name: 'KSBC' },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions,
      },
    }),
});

export const persistor = persistStore(store);
export const dispatch = store.dispatch;
