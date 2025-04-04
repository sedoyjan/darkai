import { Task } from '@/types';

export const updateParentTasksIsCompleted = (
  tasksMap: Record<string, Task>,
  taskId: string,
) => {
  const task = tasksMap[taskId];

  if (task?.parentId) {
    const parentTask = tasksMap[task.parentId];

    const allSubtasksCompleted =
      parentTask.tasks.length > 0 &&
      parentTask.tasks.every(subtaskId => tasksMap[subtaskId].isCompleted);

    parentTask.isCompleted = allSubtasksCompleted;

    updateParentTasksIsCompleted(tasksMap, parentTask.id);
  }
};

export const deleteTaskWithAllChildren = (
  tasksMap: Record<string, Task>,
  taskId: string,
) => {
  const task = tasksMap[taskId];
  const children = task?.tasks || [];
  delete tasksMap[taskId];

  children.forEach(childId => {
    deleteTaskWithAllChildren(tasksMap, childId);
  });
};

export const setTaskIsCompleteWithChildren = (
  tasksMap: Record<string, Task>,
  taskId: string,
  isCompleted: boolean,
) => {
  const task = tasksMap[taskId];
  task.isCompleted = isCompleted;
  const children = task?.tasks || [];
  children.forEach(childTaskId => {
    setTaskIsCompleteWithChildren(tasksMap, childTaskId, isCompleted);
  });
};
