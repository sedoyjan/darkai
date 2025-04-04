import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';
import { useTaskProgress } from '@/hooks/useTaskProgress';
import { useAppSelector } from '@/rdx/store';
import { selectTasksByIds } from '@/rdx/tasks/selectors';
import { sharedStyles } from '@/sharedStyles';
import { Task } from '@/types';
import { removeLineBreaks } from '@/utils';
import { ellipsize } from '@/utils/ellipsizeString';

import { BackButton } from './BackButton';
import { IconButton } from './IconButton';
import { Priority } from './Priority';
import { PillDueDate } from './Task/PillDueDate';
import { PillProgress } from './Task/PillProgress';
import { PillReminder } from './Task/PillReminder';
import { TaskTitle } from './Task/TaskTitle';

interface TaskViewerProps {
  task: Task;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  top: {
    backgroundColor: Colors.defaultTaskColor,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
  },
  titleWrapper: {
    flexShrink: 1,
  },
  buttons: {
    flexDirection: 'row',
    gap: 4,
  },
  taskTitle: {
    paddingTop: 8,
    flexShrink: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  subtasks: {
    flexDirection: 'column',
    flex: 1,
    paddingVertical: 16,
    marginBottom: 16,
  },
  captionWrapper: {
    paddingHorizontal: 16,
    marginTop: 8,
    paddingLeft: 48,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    paddingLeft: 48,
  },
});

export const TaskViewer = ({ task }: TaskViewerProps) => {
  const { completed, total } = useTaskProgress(task);
  const router = useRouter();
  const subtasks = useAppSelector(state => selectTasksByIds(state, task.tasks));

  const onEditTask = useCallback(() => {
    router.push(`/editTaskBottomSheet?taskId=${task.id}`);
  }, [router, task.id]);

  const renderItem: ListRenderItem<Task> = useCallback(
    ({ item: subtask, index }) => {
      if (!subtask) {
        return null;
      }
      return <TaskTitle key={subtask.id} task={subtask} index={index} />;
    },
    [],
  );

  const singleLineTitle = removeLineBreaks(task.title);
  const title =
    singleLineTitle.length > 0 ? ellipsize(singleLineTitle, 80) : 'New task';

  const hasMeta =
    total > 1 || task.dueDate || task.priority > 0 || task.reminders.length > 0;

  const nearestReminder = useMemo(() => {
    const reminders = task.reminders || [];

    const nearest = reminders.reduce((prev, current) => {
      return prev.reminderTime < current.reminderTime ? prev : current;
    }, reminders[0]);

    return nearest;
  }, [task?.reminders]);

  return (
    <View style={styles.wrapper}>
      <SafeAreaView edges={['top']} style={styles.top}>
        <View style={styles.header}>
          <View style={sharedStyles.row}>
            <BackButton />
            <View style={styles.titleWrapper}>
              <Text
                onPress={onEditTask}
                style={styles.taskTitle}
                numberOfLines={3}
              >
                {title}
              </Text>
            </View>
          </View>
          <View style={styles.buttons}>
            <IconButton name="pencil" onPress={onEditTask} />
          </View>
        </View>
        {task.description?.length > 0 ? (
          <TouchableOpacity style={styles.captionWrapper} onPress={onEditTask}>
            <Text style={sharedStyles.caption}>{task.description}</Text>
          </TouchableOpacity>
        ) : null}
        {hasMeta ? (
          <TouchableOpacity style={styles.meta} onPress={onEditTask}>
            {task.priority > 0 ? (
              <Priority value={task.priority} withText />
            ) : null}
            {total > 1 ? (
              <PillProgress completed={completed} total={total} />
            ) : null}
            {task.dueDate ? <PillDueDate date={task.dueDate} /> : null}
            {nearestReminder ? (
              <PillReminder date={nearestReminder.reminderTime} />
            ) : null}
          </TouchableOpacity>
        ) : null}
      </SafeAreaView>
      <FlatList
        renderItem={renderItem}
        data={subtasks}
        style={styles.subtasks}
      />
    </View>
  );
};
