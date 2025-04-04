import { createSelector } from 'reselect';

import { TaskWithDueDate } from '@/types';

import { RootState } from '..';
import { getAllSubTaskIds } from './utils';

// Base selectors
const selectTasksState = (state: RootState) => state.tasks;

export const selectTasksMap = createSelector(
  [selectTasksState],
  tasksState => tasksState.tasksMap,
);

export const selectIsGeneratingMap = createSelector(
  [selectTasksState],
  tasksState => tasksState.isGeneratingMap,
);

export const selectTasksRootIds = createSelector(
  [selectTasksState],
  tasksState =>
    Object.values(tasksState.tasksMap)
      .filter(task => !task.parentId)
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(task => task.id),
);

// Memoized selectors

export const selectTaskById = createSelector(
  [selectTasksMap, (_state: RootState, id?: string) => id],
  (tasksMap, id) => (id ? tasksMap[id] : null),
);

export const selectTasksByIds = createSelector(
  [selectTasksMap, (_state: RootState | null, ids: string[]) => ids],
  (tasksMap, ids) => ids.map(id => tasksMap[id]),
);

export const selectTasks = createSelector(
  [selectTasksMap, selectTasksRootIds],
  (tasksMap, taskIds) => taskIds.map(id => tasksMap[id]),
);

export const selectTasksWithDueDates = createSelector(
  [selectTasks],
  tasks => tasks.filter(task => task.dueDate) as TaskWithDueDate[],
);

export const selectTasksCount = createSelector(
  [selectTasks],
  tasks => tasks.length,
);

export const selectGetTasksLoading = (state: RootState) =>
  state.tasks.getTasksLoading;

export const selectTaskChildrenIds = createSelector(
  [selectTasksMap, (_state: RootState, id: string) => id],
  (tasksMap, id) => {
    return getAllSubTaskIds(tasksMap, id);
  },
);

export const selectIsTaskGenerating = createSelector(
  [selectIsGeneratingMap, (_state: RootState, id: string) => id],
  (isGeneratingMap, id) => isGeneratingMap[id] || false,
);
