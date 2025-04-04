import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import {
  AgendaList,
  CalendarProvider,
  CalendarUtils,
  ExpandableCalendar,
} from 'react-native-calendars';
import { Positions } from 'react-native-calendars/src/expandableCalendar';
import { DateData, MarkedDates } from 'react-native-calendars/src/types';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Background } from '@/components/Background';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Helper } from '@/components/Helper';
import { TaskTitle } from '@/components/Task/TaskTitle';
import { calendarTheme, Colors } from '@/constants/Colors';
import {
  selectCalendar,
  selectLanguageCode,
  selectLocale,
} from '@/rdx/app/selectors';
import { updateNewTask } from '@/rdx/newTask/slice';
import { useAppDispatch, useAppSelector } from '@/rdx/store';
import { selectTasksWithDueDates } from '@/rdx/tasks/selectors';
import { sharedStyles } from '@/sharedStyles';
import { Task, TaskWithDueDate } from '@/types';
import {
  dateStringToDateWithCurrentTime,
  updateDateKeepingTime,
} from '@/utils';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    flex: 1,
    paddingBottom: 16,
  },
  section: {
    backgroundColor: Colors.gradientStart,
    color: Colors.primaryText,
  },
  helperWrapper: {
    paddingHorizontal: 16,
  },
});

type TaskAgendaItem = Task & {
  hour: string;
};
type AgendaItemType = {
  title: string;
  data: TaskAgendaItem[];
};

const transformTasksToAgendaItems = (
  tasks: TaskWithDueDate[],
): AgendaItemType[] => {
  const sortedTasks = tasks.sort((a, b) => (a.dueDate || 0) - (b.dueDate || 0));

  const groupedTasks: {
    [key: string]: TaskAgendaItem[];
  } = {};

  sortedTasks.forEach(task => {
    const date = CalendarUtils.getCalendarDateString(new Date(task.dueDate));
    const hour = new Date(task.dueDate).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (!groupedTasks[date]) {
      groupedTasks[date] = [];
    }

    groupedTasks[date].push({
      ...task,
      hour: hour,
    });
  });

  return Object.keys(groupedTasks).map(date => ({
    title: date,
    data: groupedTasks[date],
  }));
};

export default function CalendarScreen() {
  const isFocused = useIsFocused();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO fix any
  const calendarRef = useRef<any>(null);
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const rawTasks = useAppSelector(selectTasksWithDueDates);
  const calendar = useAppSelector(selectCalendar);
  const firstWeekday =
    (calendar?.firstWeekday || 0) - 1 > 0
      ? (calendar?.firstWeekday || 0) - 1
      : 0;

  useEffect(() => {
    if (isFocused) {
      const calendarDate = calendarRef.current?.getDate();
      if (!calendarDate) {
        return;
      }
      const date = dateStringToDateWithCurrentTime(calendarDate);
      dispatch(
        updateNewTask({
          task: {
            dueDate: date.getTime(),
          },
        }),
      );
    }
  }, [dispatch, isFocused]);

  const agendaItems = useMemo(
    () => transformTasksToAgendaItems(rawTasks),
    [rawTasks],
  );
  const hasTasks = rawTasks.length > 0;

  const storedLanguageCode = useAppSelector(selectLanguageCode);
  const locale = useAppSelector(selectLocale);
  const languageCode = storedLanguageCode || locale?.currencyCode || 'en';

  const hash = rawTasks
    .map(task => {
      if (task.dueDate) {
        return task.id + task.dueDate + task.isCompleted ? 1 : 0;
      }
    })
    .join('-');

  const topkey = `top-calendar-${languageCode}-${hash}`;
  const bottomkey = `bottom-calendar-${languageCode}-${hash}`;

  const marked = useMemo<MarkedDates>(() => {
    const dates: MarkedDates = {};

    rawTasks.forEach(task => {
      const dateString = CalendarUtils.getCalendarDateString(
        new Date(task.dueDate!),
      );

      dates[dateString] = {
        marked: true,
      };
    });

    return dates;
  }, [rawTasks]);

  const onGoToNewTaskForm = useCallback(() => {
    router.push('/createTaskBottomSheet');
  }, [router]);

  const onDateChanged = useCallback(
    (dateString: string) => {
      if (!dateString) {
        return;
      }
      const date = dateStringToDateWithCurrentTime(dateString);
      dispatch(
        updateNewTask({
          task: {
            dueDate: date.getTime(),
          },
        }),
      );
    },
    [dispatch],
  );

  const onDayPress = useCallback(
    (day: DateData) => {
      const dueDate = updateDateKeepingTime(
        new Date(),
        new Date(day.timestamp),
      );

      dispatch(
        updateNewTask({
          task: {
            dueDate: dueDate.getTime(),
          },
        }),
      );
    },
    [dispatch],
  );

  const onDayLongPress = useCallback(
    (day: DateData) => {
      onDayPress(day);
      router.push('/createTaskBottomSheet');
    },
    [onDayPress, router],
  );

  const renderAgendaItem = useCallback(
    (row: { item: Task; index: number; section: { data: object[] } }) => {
      const isLast = row.index === row.section.data.length - 1;
      const { item } = row;

      return (
        <TaskTitle task={item} index={row.index} withSeparator={!isLast} />
      );
    },
    [],
  );

  const initialDate = CalendarUtils.getCalendarDateString(new Date());

  return (
    <Background>
      <CalendarProvider
        date={initialDate}
        theme={calendarTheme}
        onDateChanged={onDateChanged}
      >
        <SafeAreaView style={styles.wrapper} edges={['top']}>
          <Header
            title={t('screens.calendar.title')}
            withBackButton={false}
            rightButtonIcon="add"
            onRightButtonPress={onGoToNewTaskForm}
          />
          <ExpandableCalendar
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ref={calendarRef}
            firstDay={firstWeekday}
            markedDates={marked}
            theme={calendarTheme}
            animateScroll
            key={topkey}
            allowShadow={false}
            onDayPress={onDayPress}
            onDayLongPress={onDayLongPress}
            closeOnDayPress={false}
            initialPosition={hasTasks ? Positions.CLOSED : Positions.OPEN}
          />
          {hasTasks ? (
            <AgendaList
              bounces={false}
              key={bottomkey}
              sections={agendaItems}
              renderItem={renderAgendaItem}
              // scrollToNextEvent
              sectionStyle={styles.section}
            />
          ) : (
            <View style={sharedStyles.wrapper} />
          )}

          <View style={styles.helperWrapper}>
            <Helper
              emoji="robot"
              isVisible={!rawTasks.length}
              title={t('screens.tasks.robotWelcome')}
              text={t('screens.tasks.robotNoTasksText')}
            >
              <Button
                onPress={onGoToNewTaskForm}
                title={t('screens.tasks.createNewTask')}
                isSuccess
              />
            </Helper>
          </View>
        </SafeAreaView>
      </CalendarProvider>
    </Background>
  );
}
