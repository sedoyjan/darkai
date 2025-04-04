import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { formatDistance } from 'date-fns';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { BottomSheetContainer } from '@/components/BottomSheetContainer';
import { SettingsButton } from '@/components/SettingsButton';
import { Colors } from '@/constants/Colors';
import { useTask } from '@/hooks/useTask';
import { DATE_LOCALES, useLanguage } from '@/i18n';

export type ReminderType = {
  id: string;
  label: string;
  requiresDate?: boolean;
  offsetMs?: number;
};

const NO_VALUE_IDS = ['disable', 'custom'];

export default function ReminderBottomSheetScreen() {
  const { t } = useTranslation();
  const reminders: ReminderType[] = useMemo(() => {
    return [
      { id: 'disable', label: t('reminders.disable') },
      {
        id: 'on-date',
        label: t('reminders.onDate'),
        requiresDate: true,
        offsetMs: 0,
      },
      {
        id: '30min',
        label: t('reminders.30minBefore'),
        requiresDate: true,
        offsetMs: 30 * 60 * 1000,
      },
      {
        id: '1hour',
        label: t('reminders.1hourBefore'),
        requiresDate: true,
        offsetMs: 60 * 60 * 1000,
      },
      {
        id: '1day',
        label: t('reminders.1dayBefore'),
        requiresDate: true,
        offsetMs: 24 * 60 * 60 * 1000,
      },
      {
        id: '1week',
        label: t('reminders.1weekBefore'),
        requiresDate: true,
        offsetMs: 7 * 24 * 60 * 60 * 1000,
      },
      // { id: 'custom', label: 'Custom' },
    ];
  }, [t]);

  const router = useRouter();
  const { task, updateTask } = useTask();

  const existingRemindersIds = (task?.reminders || []).map(r => r.id);

  const onDeSelectReminder = useCallback(
    (r: ReminderType) => () => {
      const reminders = (task?.reminders || []).filter(item => {
        return item.id !== r.id;
      });

      updateTask({
        reminders,
      });
    },
    [task?.reminders, updateTask],
  );

  const onSelectReminder = useCallback(
    (r: ReminderType) => () => {
      if (task && !task.dueDate && r.requiresDate) {
        router.push(`/dueDateBottomSheet?taskId=${task.id}`);
      } else if (task?.dueDate) {
        if (r.id === 'disable') {
          return updateTask({ reminders: [] });
        } else {
          const reminders = (task.reminders || []).filter(item => {
            return item.id !== r.id;
          });
          const timestamp = task.dueDate - (r.offsetMs || 0);
          reminders.push({
            id: r.id,
            reminderTime: timestamp,
          });

          updateTask({
            reminders,
          });
        }
      }
    },
    [router, task, updateTask],
  );

  const onSetCustomReminder = useCallback(
    (_event: DateTimePickerEvent, date?: Date) => {
      if (!date) {
        return;
      }
      console.log(date);
    },
    [],
  );

  const language = useLanguage();

  return (
    <BottomSheetContainer height={380}>
      {reminders.map((item, index) => {
        const isLast = index === reminders.length - 1;
        const reminderTimestamp =
          task?.dueDate && item.offsetMs !== undefined
            ? task.dueDate - item.offsetMs
            : 0;

        const isPassed =
          reminderTimestamp > 0 && reminderTimestamp < new Date().getTime();

        const caption = item.requiresDate
          ? task?.dueDate && item.offsetMs !== undefined
            ? formatDistance(reminderTimestamp, new Date(), {
                addSuffix: true,
                locale: DATE_LOCALES[language],
              })
            : t('reminders.requiresDueDate')
          : '';

        const value = existingRemindersIds.includes(item.id) ? true : false;

        return (
          <SettingsButton
            key={item.id}
            label={item.label}
            onPress={value ? onDeSelectReminder(item) : onSelectReminder(item)}
            value={NO_VALUE_IDS.includes(item.id) ? undefined : value}
            isCheckbox
            caption={caption}
            withSeparator={!isLast}
            isDisabled={isPassed}
          >
            {item.id === 'custom' ? (
              <DateTimePicker
                minimumDate={new Date()}
                accentColor={Colors.gradientEnd}
                value={new Date(task?.dueDate || 0)}
                mode="datetime"
                display="compact"
                themeVariant="dark"
                onChange={onSetCustomReminder}
              />
            ) : null}
          </SettingsButton>
        );
      })}
    </BottomSheetContainer>
  );
}
