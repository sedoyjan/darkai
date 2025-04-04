import { Task } from '@/types';

export const getAllSubTaskIds = (
  tasksMap: Record<string, Task>,
  taskId: string,
): string[] => {
  const task = tasksMap[taskId];
  if (!task || !task.tasks) {
    return [];
  }

  const subTaskIds = task.tasks;
  const nestedSubTaskIds = subTaskIds.flatMap(subTaskId =>
    getAllSubTaskIds(tasksMap, subTaskId),
  );

  return [...subTaskIds, ...nestedSubTaskIds];
};
