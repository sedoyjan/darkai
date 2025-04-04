import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar, CalendarUtils, DateData } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';

import { BottomSheetContainer } from '@/components/BottomSheetContainer';
import { calendarTheme, Colors } from '@/constants/Colors';
import { useTask } from '@/hooks/useTask';
import { updateDateKeepingTime } from '@/utils';

const INITIAL_DATE = CalendarUtils.getCalendarDateString(new Date());

const styles = StyleSheet.create({
  content: {
    marginLeft: -16,
    marginRight: -16,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginVertical: 8,
  },
});

export default function DueDateBottomSheetScreen() {
  const { t } = useTranslation();
  const { task, updateTask } = useTask();
  const today = new Date().toISOString().split('T')[0];

  const dueDate = task?.dueDate
    ? CalendarUtils.getCalendarDateString(new Date(task.dueDate))
    : INITIAL_DATE;

  const pickerDueDate = task?.dueDate ? new Date(task.dueDate) : new Date();

  const marked = useMemo<MarkedDates>(() => {
    return {
      [dueDate]: {
        selected: true,
        disableTouchEvent: true,
      },
    };
  }, [dueDate]);

  const onDayPress = useCallback(
    (_close: () => void) => (day: DateData) => {
      const date = updateDateKeepingTime(
        task?.dueDate ? new Date(task?.dueDate) : new Date(),
        new Date(day.timestamp),
      );
      updateTask({ dueDate: date.getTime() });
    },
    [task?.dueDate, updateTask],
  );

  const onDateChange = useCallback(
    (_event: DateTimePickerEvent, date?: Date) => {
      if (!date) {
        return;
      }
      updateTask({ dueDate: date.getTime() });
    },
    [updateTask],
  );

  return (
    <BottomSheetContainer height={440}>
      {closeSheet => (
        <View style={styles.content}>
          <Calendar
            minDate={today}
            theme={calendarTheme}
            markedDates={marked}
            onDayPress={onDayPress(closeSheet)}
          />
          <View style={styles.timeRow}>
            <Text style={styles.title}>
              {t('screens.dueDateBottomSheet.time')}
            </Text>
            <DateTimePicker
              minimumDate={new Date()}
              accentColor={Colors.gradientEnd}
              value={pickerDueDate}
              mode="time"
              display="compact"
              themeVariant="dark"
              onChange={onDateChange}
            />
          </View>
        </View>
      )}
    </BottomSheetContainer>
  );
}
