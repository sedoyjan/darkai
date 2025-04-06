import { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { GetChatGetMessages200ResponseMessagesInner } from './apiClient';

export type Priority = 0 | 1 | 2 | 3;

export interface Reminder {
  id: string;
  reminderTime: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  tasks: string[];
  threadId?: string;
  createdAt: number;
  dueDate?: number;
  isCompleted: boolean;
  color?: string;
  parentId?: string;
  reminders: Reminder[];
}

export type TaskWithDueDate = Task & { dueDate: number };

export type TaskPropKey = keyof Task;

export type PartialTaskWithId = Omit<Partial<Task>, 'reminders'> & {
  id: string;
  reminders: {
    reminderTime: number;
    slug: string;
  }[];
};

export type User = Omit<
  FirebaseAuthTypes.User,
  | 'delete'
  | 'getIdToken'
  | 'getIdTokenResult'
  | 'linkWithCredential'
  | 'linkWithPopup'
  | 'linkWithRedirect'
  | 'reauthenticateWithCredential'
  | 'reauthenticateWithPopup'
  | 'reauthenticateWithRedirect'
  | 'reload'
  | 'sendEmailVerification'
  | 'unlink'
  | 'updateEmail'
  | 'updatePassword'
  | 'updatePhoneNumber'
  | 'verifyBeforeUpdateEmail'
>;

export enum ChatMessageType {
  USER = 'USER',
  BOT = 'BOT',
  SYSTEM = 'SYSTEM',
}

export type ChatMessage = Omit<
  GetChatGetMessages200ResponseMessagesInner,
  'imageUrl' | 'imageHash' | 'summaryId' | 'createdAt'
> & {
  imageUrl?: string;
  imageHash?: string;
  summaryId?: string;
  createdAt: string;
  type: ChatMessageType;
};

export interface Chat {
  id: string;
  threadId: string;
  updatedAt: string;
  messages: ChatMessage[];
}
