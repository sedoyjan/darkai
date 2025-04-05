import { AppState } from './app/slice';
import { ChatState } from './chat/slice';
import { SettingsState } from './settings/slice';

export interface RootState {
  settings: SettingsState;
  app: AppState;
  chat: ChatState;
}
