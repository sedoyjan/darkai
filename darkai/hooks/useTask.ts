import { RouteProp, useRoute } from '@react-navigation/native';
import { useCallback } from 'react';

import { RootParamList } from '@/app/_layout';
import { selectNewTask } from '@/rdx/newTask/selectors';
import { updateNewTask } from '@/rdx/newTask/slice';
import { useAppDispatch, useAppSelector } from '@/rdx/store';
import { selectTaskById } from '@/rdx/tasks/selectors';
import { updateTask } from '@/rdx/tasks/slice';
import { Task } from '@/types';

export const useTask = () => {
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<RootParamList, 'RouteWithTaskId'>>();
  const taskId = route.params?.taskId;
  const newTask = useAppSelector(selectNewTask);
  const isNewTask = !taskId || taskId === newTask.id;
  const existingTask = useAppSelector(state => selectTaskById(state, taskId));
  const task = isNewTask ? newTask : existingTask;

  const update = useCallback(
    (data: Partial<Task>) => {
      if (isNewTask) {
        dispatch(
          updateNewTask({
            task: data,
          }),
        );
      } else {
        if (taskId) {
          dispatch(updateTask({ id: taskId, task: data }));
        }
      }
    },
    [dispatch, isNewTask, taskId],
  );

  return { task, isNewTask, taskId, updateTask: update };
};
