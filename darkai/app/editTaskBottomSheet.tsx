import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheetContainer } from '@/components/BottomSheetContainer';
import { IconButton } from '@/components/IconButton';
import { Separator } from '@/components/Separator';
import { TaskEditorBottomSheet } from '@/components/TaskEditor/TaskEditorBottomSheet';
import { Colors } from '@/constants/Colors';
import { useTask } from '@/hooks/useTask';
import { clearNewTask } from '@/rdx/newTask/slice';
import { useAppDispatch } from '@/rdx/store';
import { removeTask } from '@/rdx/tasks/slice';
import { sharedStyles } from '@/sharedStyles';

const styles = StyleSheet.create({
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: -8,
    marginRight: -8,
    marginTop: -8,
  },

  separator: { marginBottom: 4 },
});

export default function EditTaskBottomSheetScreen() {
  const router = useRouter();
  const { updateTask, task } = useTask();
  const dispatch = useAppDispatch();

  const isDisabled = !task || !task.title || task.title?.length < 3;

  const onBsClose = useCallback(() => {
    dispatch(clearNewTask());
  }, [dispatch]);

  const onDeleteTask = useCallback(
    (closeBs: () => Promise<void>) => () => {
      if (!task) {
        return;
      }
      closeBs().then(() => {
        requestAnimationFrame(() => {
          dispatch(removeTask({ id: task.id }));
        });
      });
    },
    [dispatch, task],
  );

  useEffect(() => {
    if (!task) {
      router.back();
    }
  }, [router, task]);

  if (!task) {
    return null;
  }

  return (
    <BottomSheetContainer height={190} onClose={onBsClose}>
      {closeBs => (
        <View style={sharedStyles.gap}>
          <TaskEditorBottomSheet
            onTaskUpdate={updateTask}
            autoFocus
            isSubtask={task?.parentId ? true : false}
            onSubmit={closeBs}
            task={task}
          />
          <Separator left={-16} right={-16} style={styles.separator} />
          <View style={styles.bottom}>
            <IconButton
              disabled={isDisabled}
              name="trash-bin"
              onPress={onDeleteTask(closeBs)}
              color={Colors.errorColor}
              size={28}
            />
            <IconButton
              disabled={isDisabled}
              name="arrow-up-circle"
              onPress={closeBs}
              size={28}
            />
          </View>
        </View>
      )}
    </BottomSheetContainer>
  );
}
