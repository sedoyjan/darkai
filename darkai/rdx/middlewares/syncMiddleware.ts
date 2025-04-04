import { Action, Middleware, ThunkDispatch } from '@reduxjs/toolkit';
import { detailedDiff } from 'deep-object-diff';

import { apiClient } from '@/api';
import { crashlytics } from '@/services/firebase';
import { PartialTaskWithId, Task, TaskPropKey } from '@/types';
import { isTask } from '@/utils';

import { RootState } from '..';
import { selectUser } from '../app/selectors';

const createTask = async (task: Task) => {
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
          reminderTime: r.reminderTime,
          slug: r.id,
        };
      }),
      tasks: task.tasks,
      threadId: task.threadId,
      title: task.title,
      parentId: task.parentId,
    })
    .catch(e => {
      console.error('postTaskCreate', e);
      crashlytics.recordError(e);
    });
};

interface DetailedDiff {
  added: Record<string, Partial<Task>>;
  deleted: Record<string, Partial<Task>>;
  updated: Record<string, Partial<Task>>;
}

const sync = async (
  before: Record<string, Task>,
  after: Record<string, Task>,
) => {
  const changes = detailedDiff(before, after) as DetailedDiff;

  if (Object.keys(changes.added).length) {
    const added = changes.added as Record<string, Task>;

    for (const id in added) {
      const task = added[id];
      if (isTask(task)) {
        createTask(task);
      } else {
        Object.keys(task).forEach(key => {
          const taskKey = key as TaskPropKey;
          const modifiedData = after[id][taskKey];
          if (!changes.updated[id]) {
            changes.updated[id] = {};
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          changes.updated[id][taskKey] = modifiedData;
        });
      }
    }
  }

  if (Object.keys(changes.deleted).length) {
    const deleted = changes.deleted as Record<string, Task>;

    const ids: string[] = [];

    for (const id in deleted) {
      if (deleted[id] === undefined) {
        ids.push(id);
      } else {
        for (const key in deleted[id]) {
          const taskKey = key as TaskPropKey;
          const modifiedData = after[id][taskKey];
          if (!changes.updated[id]) {
            changes.updated[id] = {};
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          changes.updated[id][taskKey] = modifiedData;
        }
      }
    }

    if (ids.length > 0) {
      await apiClient
        .postTaskDelete({
          ids,
        })
        .catch(e => {
          console.error('postTaskDelete', e);
          crashlytics.recordError(e);
        });
    }
  }

  if (Object.keys(changes.updated).length) {
    const updated = changes.updated as Record<string, Partial<Task>>;
    const tasks: PartialTaskWithId[] = [];

    for (const id in updated) {
      const task = updated[id];

      if (
        task.reminders &&
        !Array.isArray(task.reminders) &&
        !Object.keys(task.reminders as object).length
      ) {
        task.reminders = [];
      }

      const reminders = (task.reminders || []).map(reminder => ({
        reminderTime: reminder.reminderTime,
        slug: reminder.id,
      }));

      tasks.push({ id, ...task, reminders });
    }

    await apiClient.postTaskUpdate(tasks).catch(e => {
      console.error('postTaskUpdate', e);
      crashlytics.recordError(e);
    });
  }
};

const IGNORED_ACTIONS = ['tasks/setTasks', 'tasks/setGetTasksLoading'];

export const syncMiddleware: Middleware<
  {},
  RootState,
  ThunkDispatch<RootState, unknown, Action>
> =
  ({ getState }) =>
  next =>
  async a => {
    const action = a as Action;

    if (
      action.type.startsWith('tasks/') &&
      !IGNORED_ACTIONS.includes(action.type)
    ) {
      const user = selectUser(getState());
      if (!user) {
        return next(action);
      }
      const prevState = getState().tasks.tasksMap;
      const result = next(action);
      const newState = getState().tasks.tasksMap;

      sync(prevState, newState);

      return result;
    } else {
      return next(action);
    }
  };
