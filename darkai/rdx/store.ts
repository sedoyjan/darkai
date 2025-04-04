import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore, Middleware } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { createLogger } from 'redux-logger';
import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

import { RootState } from './index';
import { syncMiddleware } from './middlewares/syncMiddleware';
import { rootReducer } from './rootReducer';

const logger = createLogger({
  collapsed: true,
  diff: true,
  predicate: (_getState, action) =>
    !action.type.includes('curUser/setCurUser') &&
    !action.type.includes('connectionState/setConnectionState') &&
    !action.type.includes('curUser/update-cur-user'),
});

const middlewares: Middleware[] = [];

if (__DEV__) {
  middlewares.push(logger);
}

middlewares.push(syncMiddleware);

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  version: 2,
  storage: AsyncStorage,
  whitelist: ['tasks', 'settings', 'app'],
  stateReconciler: autoMergeLevel2,
  // transforms: [
  //   createFilter(
  //     'chat',
  //     ['rooms', 'messagesByRoom'],
  //     ['rooms', 'messagesByRoom'],
  //   ),
  // ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'persist/PERSIST',
          'persist/PURGE',
          'persist/REHYDRATE',
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['register', 'rehydrate', 'result'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }).concat(middlewares),
});
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
