import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Background } from '@/components/Background';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Helper } from '@/components/Helper';
import { Loader } from '@/components/Loader';
import { TaskViewer } from '@/components/TaskViewer';
import { Colors } from '@/constants/Colors';
import { tryToDecomposeTaskWithAiThunk } from '@/rdx/app/thunks';
import { useAppDispatch, useAppSelector } from '@/rdx/store';
import {
  selectIsTaskGenerating,
  selectTaskById,
  selectTasksCount,
} from '@/rdx/tasks/selectors';

import { TasksStackParamList } from './_layout';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    gap: 16,
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 16,
  },
  helperText: {
    color: Colors.primaryText,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default function TaskScreen() {
  const { t } = useTranslation();
  const tasksCount = useAppSelector(selectTasksCount);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const route = useRoute<RouteProp<TasksStackParamList, 'Task'>>();
  const taskId = route.params.task;
  const task = useAppSelector(state => selectTaskById(state, taskId));
  const isFocused = useIsFocused();
  const isGeneratingSubtasks = useAppSelector(state =>
    selectIsTaskGenerating(state, taskId),
  );

  useEffect(() => {
    if (isFocused && !task) {
      setTimeout(() => {
        if (router.canGoBack()) {
          router.back();
        }
      }, 100);
    }
  }, [isFocused, router, task]);

  const onGenerateSubTasksAi = useCallback(async () => {
    if (task) {
      dispatch(
        tryToDecomposeTaskWithAiThunk({
          taskId: task.id,
        }),
      );
    }
  }, [dispatch, task]);

  const onAddSubTask = useCallback(() => {
    if (task) {
      router.push(`/createTaskBottomSheet?parentTaskId=${task.id}`);
    }
  }, [router, task]);

  if (!task) {
    return (
      <Background>
        <SafeAreaView style={styles.wrapper}>
          <Header />
        </SafeAreaView>
      </Background>
    );
  }

  const isHelperVisible =
    !task.tasks.length &&
    tasksCount === 1 &&
    !task.parentId &&
    !isGeneratingSubtasks;

  return (
    <Background>
      <TaskViewer task={task} />
      <View style={styles.content}>
        <Button
          title={t('components.taskViewer.addSubtask')}
          onPress={onAddSubTask}
        />
        <Helper
          title={t('screens.tasks.subtasks')}
          isVisible={isHelperVisible}
          emoji="stars"
        >
          <Text style={styles.helperText}>
            {t('screens.tasks.subtasksHelperText')}
          </Text>
        </Helper>
        <View>
          <Button
            title={t('screens.tasks.generateSubtasksWithAi')}
            onPress={onGenerateSubTasksAi}
            isSuccess
          />
        </View>
      </View>
      <Loader isVisible={isGeneratingSubtasks} />
    </Background>
  );
}
