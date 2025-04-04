import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Task } from '@/types';
import { uuid } from '@/utils';

export interface NewTaskState {
  task: Task;
}

const defaultTask: Task = {
  createdAt: Date.now(),
  title: '',
  description: '',
  dueDate: undefined,
  id: uuid(),
  isCompleted: false,
  priority: 0,
  reminders: [],
  tasks: [],
  parentId: undefined,
  color: undefined,
  threadId: undefined,
};

const initialState: NewTaskState = {
  task: defaultTask,
};

export const newTaskSlice = createSlice({
  name: 'newTask',
  initialState,
  reducers: {
    updateNewTask: (
      state,
      action: PayloadAction<{
        task: Partial<Task>;
      }>,
    ) => {
      state.task = {
        ...state.task,
        ...action.payload.task,
      };
    },
    clearNewTask: state => {
      state.task = { ...defaultTask, createdAt: Date.now(), id: uuid() };
    },
  },
});

export const newTaskReducer = newTaskSlice.reducer;

export const { updateNewTask, clearNewTask } = newTaskSlice.actions;
