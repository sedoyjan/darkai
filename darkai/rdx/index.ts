import { AppState } from './app/slice';
import { NewTaskState } from './newTask/slice';
import { SettingsState } from './settings/slice';
import { TasksState } from './tasks/slice';

export interface RootState {
  tasks: TasksState;
  settings: SettingsState;
  app: AppState;
  newTask: NewTaskState;
}
