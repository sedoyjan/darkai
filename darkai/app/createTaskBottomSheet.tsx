import { RouteProp, useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheetContainer } from '@/components/BottomSheetContainer';
import { IconButton } from '@/components/IconButton';
import { Separator } from '@/components/Separator';
import { TaskEditorBottomSheet } from '@/components/TaskEditor/TaskEditorBottomSheet';
import { selectNewTask } from '@/rdx/newTask/selectors';
import { clearNewTask, updateNewTask } from '@/rdx/newTask/slice';
import { useAppDispatch, useAppSelector } from '@/rdx/store';
import { selectTasksCount } from '@/rdx/tasks/selectors';
import { addTask } from '@/rdx/tasks/slice';
import { sharedStyles } from '@/sharedStyles';
import { Task } from '@/types';

import { TasksStackParamList } from './(tabs)/(tasks)/_layout';

const styles = StyleSheet.create({
  bottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    marginRight: -8,
    marginTop: -8,
  },
  separator: { marginBottom: 4 },
});

export default function CreateTaskBottomSheetScreen() {
  const tasksCount = useAppSelector(selectTasksCount);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<TasksStackParamList, 'CreateTask'>>();
  const parentTaskId = route.params?.parentTaskId;
  const newTask = useAppSelector(selectNewTask);

  const isDisabled = !newTask || !newTask.title || newTask.title?.length < 3;

  const onCreateTask = useCallback(
    (closeBs: () => Promise<void>) => async () => {
      if (!newTask) {
        return;
      }

      dispatch(
        addTask({
          task: { ...newTask, parentId: parentTaskId },
        }),
      );

      dispatch(clearNewTask());
      if (!parentTaskId) {
        closeBs().then(() => {
          requestAnimationFrame(() => {
            if (!tasksCount) {
              router.push(`/(tabs)/(tasks)/${newTask.id}`);
            }
          });
        });
      }
    },
    [dispatch, newTask, parentTaskId, router, tasksCount],
  );

  const onTaskUpdate = useCallback(
    (updatedTask: Partial<Task>) => {
      dispatch(updateNewTask({ task: updatedTask }));
    },
    [dispatch],
  );

  const onBsClose = useCallback(() => {
    dispatch(clearNewTask());
  }, [dispatch]);

  return (
    <BottomSheetContainer height={160} onClose={onBsClose}>
      {closeBs => (
        <View style={sharedStyles.gap}>
          <TaskEditorBottomSheet
            onTaskUpdate={onTaskUpdate}
            autoFocus
            isSubtask={parentTaskId ? true : false}
            onSubmit={onCreateTask(closeBs)}
            task={newTask}
          />
          <Separator left={-16} right={-16} style={styles.separator} />
          <View style={styles.bottom}>
            <IconButton
              disabled={isDisabled}
              name="arrow-up-circle"
              onPress={onCreateTask(closeBs)}
              style={styles.button}
              size={28}
            />
          </View>
        </View>
      )}
    </BottomSheetContainer>
  );
}
