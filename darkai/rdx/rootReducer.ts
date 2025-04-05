import { combineReducers } from '@reduxjs/toolkit';

import { appReducer } from './app/slice';
import { chatReducer } from './chat/slice';
import { settingsReducer } from './settings/slice';

export const rootReducer = combineReducers({
  chat: chatReducer,
  settings: settingsReducer,
  app: appReducer,
});
