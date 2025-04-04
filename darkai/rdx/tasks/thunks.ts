import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '@/api';
import { crashlytics } from '@/services/firebase';
import { Priority, Task } from '@/types';

import { RootState } from '..';
import { selectUser } from '../app/selectors';
import { setHasFreeRequests } from '../app/slice';
import { selectTasksMap } from './selectors';
import { setGetTasksLoading, setTaskIsGenerating, setTasks } from './slice';

export const fetchTasksThunk = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>('tasks/fetchTasksThunk', async (_, { dispatch, getState }) => {
  const state = getState();
  const user = selectUser(state);

  if (user) {
    dispatch(setGetTasksLoading(true));

    try {
      const { data } = await apiClient.getTaskList();

      const tasks = data.map<Task>(item => {
        return {
          ...item,
          isGenerating: false,
          priority: item.priority as Priority,
          reminders: item.reminders.map(r => {
            return {
              id: r.slug,
              reminderTime: r.reminderTime,
            };
          }),
        };
      });

      dispatch(
        setTasks({
          tasks,
        }),
      );
    } catch (error) {
      console.error('Error while fetching tasks', error);
      crashlytics.recordError(error as Error);
    }
    dispatch(setGetTasksLoading(false));
  }
});

export const syncLocalTasksThunk = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>('tasks/syncLocalTasksThunk', async (_, { getState }) => {
  const { data: existingTasks } = await apiClient.getTaskListIds();
  const state = getState();
  const tasksMap = selectTasksMap(state);
  const ids = Object.keys(tasksMap);

  for (const id of ids) {
    if (!existingTasks.includes(id)) {
      const task = tasksMap[id];
      await apiClient
        .postTaskCreate({
          createdAt: task.createdAt,
          description: task.description,
          dueDate: task.dueDate,
          id: task.id,
          isCompleted: task.isCompleted,
          priority: task.priority,
          reminders: task.reminders.map(r => {
            return {
              slug: r.id,
              reminderTime: r.reminderTime,
            };
          }),
          tasks: task.tasks,
          threadId: task.threadId,
          title: task.title,
        })
        .catch(e => {
          console.error('postTaskCreate', e);
          crashlytics.recordError(e);
        });
    }
  }
});

export const decomposeTaskThunk = createAsyncThunk<
  void,
  { id: string },
  { state: RootState }
>('tasks/decomposeTaskThunk', async ({ id }, { dispatch }) => {
  dispatch(setTaskIsGenerating({ id, isGenerating: true }));
  try {
    const { data } = await apiClient.postTaskDecompose({ id });
    const tasks = data.map<Task>(item => {
      return {
        ...item,
        reminders: item.reminders.map(r => {
          return {
            id: r.slug,
            reminderTime: r.reminderTime,
          };
        }),
        isGenerating: false,
        priority: item.priority as Priority,
      };
    });
    dispatch(
      setTasks({
        tasks,
      }),
    );

    try {
      const { data } = await apiClient.getUserMe();
      dispatch(setHasFreeRequests({ value: data.hasFreeRequests }));
    } catch (error) {
      console.error('getUserMe error', error);
    }
  } catch (error) {
    console.error('Error while decomposing task', error);
    crashlytics.recordError(error as Error);
  }
  dispatch(setTaskIsGenerating({ id, isGenerating: false }));
});
