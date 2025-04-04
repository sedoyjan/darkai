import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { Task } from '@/types';

import {
  deleteTaskWithAllChildren,
  setTaskIsCompleteWithChildren,
  updateParentTasksIsCompleted,
} from './taskUtils';

export interface TasksState {
  getTasksLoading: boolean;
  tasksMap: Record<string, Task>;
  isGeneratingMap: Record<string, boolean>;
}

const initialState: TasksState = {
  getTasksLoading: false,
  tasksMap: {},
  isGeneratingMap: {},
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setGetTasksLoading: (state, action: PayloadAction<boolean>) => {
      state.getTasksLoading = action.payload;
    },
    clearTasks: state => {
      state.tasksMap = {};
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: string; task: Partial<Task> }>,
    ) => {
      const { id, task } = action.payload;
      state.tasksMap[id] = { ...state.tasksMap[id], ...task };
    },
    dropTaskGenerating: state => {
      state.isGeneratingMap = {};
    },
    setTaskIsGenerating: (
      state,
      action: PayloadAction<{ id: string; isGenerating: boolean }>,
    ) => {
      state.isGeneratingMap[action.payload.id] = action.payload.isGenerating;
    },
    setTaskIsComplete: (
      state,
      action: PayloadAction<{ id: string; isCompleted: boolean }>,
    ) => {
      const { id, isCompleted } = action.payload;

      setTaskIsCompleteWithChildren(state.tasksMap, id, isCompleted);
      updateParentTasksIsCompleted(state.tasksMap, id);
    },
    addTask: (state, action: PayloadAction<{ task: Task }>) => {
      const newTask: Task = {
        ...action.payload.task,
      };
      if (newTask.parentId) {
        const parentTask = state.tasksMap[newTask.parentId];
        parentTask.tasks.push(newTask.id);
        parentTask.isCompleted = false;
      }

      state.tasksMap[newTask.id] = newTask;
    },
    setTasks: (state, action: PayloadAction<{ tasks: Task[] }>) => {
      state.tasksMap = {
        ...state.tasksMap,
        ...action.payload.tasks.reduce(
          (acc, task) => ({ ...acc, [task.id]: task }),
          {},
        ),
      };
    },
    removeTask: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;

      const removedTask = state.tasksMap[id];

      if (removedTask?.parentId) {
        const parentTask = state.tasksMap[removedTask.parentId];
        parentTask.tasks = parentTask.tasks.filter(item => item !== id);
      }

      updateParentTasksIsCompleted(state.tasksMap, id);
      deleteTaskWithAllChildren(state.tasksMap, id);
    },
  },
});

export const tasksReducer = tasksSlice.reducer;

export const {
  setGetTasksLoading,
  updateTask,
  addTask,
  removeTask,
  setTaskIsComplete,
  setTaskIsGenerating,
  dropTaskGenerating,
  clearTasks,
  setTasks,
} = tasksSlice.actions;
