import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useTaskProgress } from '@/hooks/useTaskProgress';
import { useAppDispatch } from '@/rdx/store';
import { setTaskIsComplete } from '@/rdx/tasks/slice';
import { sounds } from '@/services/sounds';
import { sharedStyles } from '@/sharedStyles';
import { Task } from '@/types';
import { removeLineBreaks } from '@/utils';
import { ellipsize } from '@/utils/ellipsizeString';

import { CheckBox } from '../CheckBox';
import { Priority } from '../Priority';
import { Separator } from '../Separator';
import { PillDueDate } from './PillDueDate';
import { PillProgress } from './PillProgress';
import { PillReminder } from './PillReminder';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingLeft: 16,
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    paddingRight: 16,
  },
  texts: {
    flex: 1,
    gap: 8,
    flexDirection: 'column',
  },
  meta: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingRight: 16,
  },
  touchableWrapper: {
    flex: 1,
  },
  content: {
    marginLeft: 8,
  },
  contentComplete: {
    marginLeft: 8,
    opacity: 0.5,
  },
});

interface TaskTitleProps {
  task: Task;
  isInner?: boolean;
  style?: ViewStyle;
  index: number;
  numberOfLines?: number;
  withSeparator?: boolean;
}

export const TaskTitle = memo(
  ({
    task,
    style,
    index,
    numberOfLines,
    withSeparator = true,
  }: TaskTitleProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { completed, total } = useTaskProgress(task);

    const onPress = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push(`/(tasks)/${task.id}?title=${task.title}`);
    }, [router, task]);

    const onLongPress = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
      router.push(`/editTaskBottomSheet?taskId=${task.id}`);
    }, [router, task?.id]);

    const wrapperStyles = useMemo(() => {
      return [styles.wrapper, style];
    }, [style]);

    const onChangeIsComplete = useCallback(
      (value: boolean) => {
        if (value) {
          sounds.playComplete();
        }
        dispatch(
          setTaskIsComplete({
            id: task.id,
            isCompleted: value,
          }),
        );
      },
      [dispatch, task?.id],
    );

    const nearestReminder = useMemo(() => {
      const reminders = task.reminders || [];

      const nearest = reminders.reduce((prev, current) => {
        return prev.reminderTime < current.reminderTime ? prev : current;
      }, reminders[0]);

      return nearest;
    }, [task?.reminders]);

    if (!task) {
      return null;
    }

    const singleLineTitle = removeLineBreaks(task?.title);
    const title =
      singleLineTitle.length > 0
        ? ellipsize(singleLineTitle, 80)
        : t('common.newTask');

    return (
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        delay={100 + index * 60}
      >
        <View style={wrapperStyles}>
          <CheckBox onChange={onChangeIsComplete} value={task.isCompleted} />
          <View style={styles.touchableWrapper}>
            <TouchableOpacity
              onLongPress={onLongPress}
              onPress={onPress}
              style={task.isCompleted ? styles.contentComplete : styles.content}
            >
              <View style={styles.inner}>
                <View style={styles.texts}>
                  <Text style={sharedStyles.title}>{title}</Text>
                  {task.description?.length > 0 ? (
                    <Text
                      style={sharedStyles.caption}
                      numberOfLines={numberOfLines || undefined}
                    >
                      {task.description}
                    </Text>
                  ) : null}
                </View>

                <Priority value={task.priority} />
              </View>
              <View style={styles.meta}>
                {total > 1 ? (
                  <PillProgress completed={completed} total={total} />
                ) : null}
                {task.dueDate ? <PillDueDate date={task.dueDate} /> : null}
                {nearestReminder ? (
                  <PillReminder date={nearestReminder.reminderTime} />
                ) : null}
              </View>
              {withSeparator ? <Separator /> : null}
            </TouchableOpacity>
          </View>
        </View>
      </MotiView>
    );
  },
);

TaskTitle.displayName = 'TaskTitle';
