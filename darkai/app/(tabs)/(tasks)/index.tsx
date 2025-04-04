import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import Swipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Background } from '@/components/Background';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Helper } from '@/components/Helper';
import { TaskRightActionButton } from '@/components/Task/TaskRightActionButton';
import { TaskTitle } from '@/components/Task/TaskTitle';
import { Colors } from '@/constants/Colors';
import { EMPTY_STRING } from '@/constants/Texts';
import {
  selectIsOnboardingPassed,
  selectIsOnboardingSkipped,
} from '@/rdx/app/selectors';
import { updateNewTask } from '@/rdx/newTask/slice';
import { selectShowCompletedTasks } from '@/rdx/settings/selectors';
import { useAppDispatch, useAppSelector } from '@/rdx/store';
import { selectGetTasksLoading, selectTasks } from '@/rdx/tasks/selectors';
import { fetchTasksThunk } from '@/rdx/tasks/thunks';
import { Task } from '@/types';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    flex: 1,
    paddingBottom: 16,
  },
  list: {
    marginBottom: 16,
    flexDirection: 'column',
    flex: 1,
  },
  task: {
    marginBottom: 4,
  },
  inner: {
    paddingHorizontal: 16,
  },
});

const IS_SWIPEABLE_ENABLED = false;

function TasksListScreen() {
  const { t } = useTranslation();
  const showCompletedTasks = useAppSelector(selectShowCompletedTasks);
  const rawTasks = useAppSelector(selectTasks);
  const router = useRouter();
  const getTasksLoading = useAppSelector(selectGetTasksLoading);
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const isOnboardingPassed = useAppSelector(selectIsOnboardingPassed);
  const isOnboardingSkipped = useAppSelector(selectIsOnboardingSkipped);
  const shouldShowOnboarding = !isOnboardingPassed && !isOnboardingSkipped;

  useEffect(() => {
    if (isFocused) {
      dispatch(
        updateNewTask({
          task: {
            dueDate: undefined,
          },
        }),
      );

      if (shouldShowOnboarding) {
        router.push('/onboardingModal');
      }
    }
  }, [dispatch, isFocused, router, shouldShowOnboarding]);

  const tasks = useMemo(() => {
    return rawTasks
      .sort((a, b) => {
        if (a.isCompleted && !b.isCompleted) {
          return 1;
        }
        if (!a.isCompleted && b.isCompleted) {
          return -1;
        }
        return 0;
      })
      .filter(task => {
        if (showCompletedTasks) {
          return true;
        }
        return !task.isCompleted;
      });
  }, [rawTasks, showCompletedTasks]);

  const onGoToNewTaskForm = useCallback(() => {
    router.push('/createTaskBottomSheet');
  }, [router]);

  const renderRightActions = useCallback(
    (
      progressAnimatedValue: SharedValue<number>,
      dragAnimatedValue: SharedValue<number>,
      swipeable: SwipeableMethods,
    ) => {
      return (
        <TaskRightActionButton
          dragAnimatedValue={dragAnimatedValue}
          progressAnimatedValue={progressAnimatedValue}
          swipeable={swipeable}
        />
      );
    },
    [],
  );

  const renderItem: ListRenderItem<Task> = useCallback(
    ({ item: task, index }) => {
      const isLast = index === tasks.length - 1;
      if (!IS_SWIPEABLE_ENABLED) {
        return (
          <TaskTitle
            index={index}
            task={task}
            key={task?.id}
            style={isLast ? undefined : styles.task}
            numberOfLines={2}
          />
        );
      }
      return (
        <Swipeable
          enabled
          renderRightActions={renderRightActions}
          dragOffsetFromRightEdge={100}
          overshootRight={false}
          minDist={5}
        >
          <TaskTitle
            index={index}
            task={task}
            key={task?.id}
            style={isLast ? undefined : styles.task}
            numberOfLines={2}
          />
        </Swipeable>
      );
    },
    [renderRightActions, tasks.length],
  );

  const onRefresh = useCallback(() => {
    dispatch(fetchTasksThunk());
  }, [dispatch]);

  const onOpenOptions = useCallback(() => {
    router.push('/optionsBottomSheet');
  }, [router]);

  const refreshControl = useMemo(() => {
    return (
      <RefreshControl
        refreshing={getTasksLoading}
        onRefresh={onRefresh}
        title={EMPTY_STRING}
        tintColor={Colors.primaryText}
        titleColor={Colors.primaryText}
      />
    );
  }, [getTasksLoading, onRefresh]);

  return (
    <Background>
      <SafeAreaView style={styles.wrapper} edges={['top']}>
        <Header
          title={t('screens.tasks.title')}
          withBackButton={false}
          rightButtonIcon="add"
          onRightButtonPress={onGoToNewTaskForm}
          secondRightButtonIcon="options-outline"
          secondOnRightButtonPress={onOpenOptions}
        />
        <FlatList
          style={styles.list}
          contentInsetAdjustmentBehavior="automatic"
          data={tasks}
          renderItem={renderItem}
          refreshControl={refreshControl}
        />

        <View style={styles.inner}>
          <Helper
            emoji="robot"
            isVisible={!tasks.length}
            title={t('screens.tasks.robotWelcome')}
            text={t('screens.tasks.robotNoTasksText')}
          >
            <Button
              onPress={onGoToNewTaskForm}
              title={t('screens.tasks.createNewTask')}
              isSuccess
            />
          </Helper>
          {tasks.length > 0 ? (
            <Button
              title={t('screens.tasks.createTask')}
              onPress={onGoToNewTaskForm}
            />
          ) : null}
        </View>
      </SafeAreaView>
    </Background>
  );
}

export default memo(TasksListScreen);
