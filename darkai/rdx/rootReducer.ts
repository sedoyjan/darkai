import { combineReducers } from '@reduxjs/toolkit';

import { appReducer } from './app/slice';
import { newTaskReducer } from './newTask/slice';
import { settingsReducer } from './settings/slice';
import { tasksReducer } from './tasks/slice';

export const rootReducer = combineReducers({
  tasks: tasksReducer,
  settings: settingsReducer,
  app: appReducer,
  newTask: newTaskReducer,
});
