import { useRouter } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors, PRIORITY_COLORS } from '@/constants/Colors';
import { useFormatDistance } from '@/i18n';
import { selectHasActiveSubscription } from '@/rdx/app/selectors';
import { useAppSelector } from '@/rdx/store';
import { Task } from '@/types';

import { Button } from '../Button';
import { Icon } from '../Icon';
import { Input } from '../Input';

interface TaskEditorBottomSheetProps {
  isSubtask?: boolean;
  autoFocus?: boolean;
  task: Task;
  onTaskUpdate: (task: Partial<Task>) => void;
  onSubmit?: () => void;
}

const styles = StyleSheet.create({
  inputWrapper: {
    backgroundColor: Colors.transparent,
    borderWidth: 0,
    padding: 0,
  },
  titleInput: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 8,
    maxHeight: 100,
  },
  inputDescription: { maxHeight: 100, fontSize: 14, marginBottom: 16 },
  scrollViewContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  button: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRow: { flexDirection: 'row' },
  inputs: { flex: 1 },
});

export const TaskEditorBottomSheet = memo(
  ({
    onTaskUpdate,
    task,
    autoFocus,
    isSubtask,
    onSubmit,
  }: TaskEditorBottomSheetProps) => {
    const { t } = useTranslation();
    const hasActiveSubscription = useAppSelector(selectHasActiveSubscription);
    const titleInputRef = useRef<TextInput>(null);
    const router = useRouter();
    const { title, description } = task;

    useEffect(() => {
      if (autoFocus && isSubtask && !title.length) {
        const timeout = setTimeout(() => titleInputRef.current?.focus(), 0);
        return () => clearTimeout(timeout);
      }
    }, [autoFocus, isSubtask, title.length]);

    const setCleanTitle = useCallback(
      (value: string) => {
        onTaskUpdate({ title: value });
      },
      [onTaskUpdate],
    );

    const setCleanDescription = useCallback(
      (value: string) => {
        onTaskUpdate({ description: value });
      },
      [onTaskUpdate],
    );

    const formattedDueDate = useFormatDistance(task.dueDate || 0);
    const dueDateTitle = task.dueDate
      ? formattedDueDate
      : t('screens.taskEditor.dueDate');

    const priorityLabels = useMemo(
      () => ({
        0: t('components.priority.lowest'),
        1: t('components.priority.low'),
        2: t('components.priority.medium'),
        3: t('components.priority.high'),
      }),
      [t],
    );

    const notificationsTitle = t('screens.taskEditor.reminders');

    const onCalendarButtonPress = useCallback(() => {
      router.push(`/dueDateBottomSheet?taskId=${task.id}`);
    }, [router, task.id]);

    const onFlagButtonPress = useCallback(() => {
      router.push(`/priorityBottomSheet?taskId=${task.id}`);
    }, [router, task.id]);

    const onAlarmButtonPress = useCallback(() => {
      router.push(
        hasActiveSubscription
          ? `/reminderBottomSheet?taskId=${task.id}`
          : `/subscriptionModal`,
      );
    }, [hasActiveSubscription, router, task.id]);

    const onClose = useCallback(() => {
      router.back();
    }, [router]);

    return (
      <View>
        <View style={styles.topRow}>
          <View style={styles.inputs}>
            <Input
              ref={titleInputRef}
              wrapperStyle={styles.inputWrapper}
              style={styles.titleInput}
              autoFocus={autoFocus}
              value={title}
              onChangeText={setCleanTitle}
              placeholder={t('screens.taskEditor.title')}
              onSubmitEditing={onSubmit}
              returnKeyType="done"
              multiline={false}
              blurOnSubmit={true}
            />
            <Input
              wrapperStyle={styles.inputWrapper}
              style={styles.inputDescription}
              value={description}
              onChangeText={setCleanDescription}
              placeholder={t('screens.taskEditor.description')}
            />
          </View>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Icon name="close-circle" size={24} color={Colors.semiWhite} />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          horizontal
          keyboardShouldPersistTaps="always"
          showsHorizontalScrollIndicator={false}
        >
          <Button
            onPress={onCalendarButtonPress}
            icon="calendar"
            isSmall
            title={dueDateTitle}
          />
          <Button
            onPress={onFlagButtonPress}
            icon="flag"
            isSmall
            title={priorityLabels[task.priority]}
            color={PRIORITY_COLORS[task.priority]}
          />
          <Button
            onPress={onAlarmButtonPress}
            icon="alarm"
            isSmall
            title={notificationsTitle}
            isPro={!hasActiveSubscription}
          />
        </ScrollView>
      </View>
    );
  },
);
