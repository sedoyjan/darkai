import { useAppSelector } from '@/rdx/store';
import { selectTasksMap } from '@/rdx/tasks/selectors';
import { Task } from '@/types';

const getTotalAndCompleted = (
  taskIds: string[],
  tasksMap: Record<string, Task>,
) => {
  const subtasks = taskIds.map(id => tasksMap[id]);

  return subtasks.reduce(
    (acc, subtask) => {
      if (!subtask) {
        return acc;
      }

      if (!subtask.tasks.length) {
        acc.total += 1;
      }
      if (subtask.isCompleted && !subtask.tasks.length) {
        acc.completed += 1;
      }

      if (subtask.tasks.length > 0) {
        const { total, completed } = getTotalAndCompleted(
          subtask.tasks,
          tasksMap,
        );
        acc.total += total;
        acc.completed += completed;
      }

      acc.progress =
        acc.total > 0 ? Math.round((acc.completed / acc.total) * 100) : 0;

      return acc;
    },
    {
      total: 0,
      completed: 0,
      progress: 0,
    },
  );
};

export const useTaskProgress = (task: Task) => {
  const tasksMap = useAppSelector(selectTasksMap);
  return getTotalAndCompleted([task?.id], tasksMap);
};
