import Toast from 'react-native-root-toast';
import { default as uuidLib } from 'react-native-uuid';

import { Task } from './types';

export const uuid = () => {
  return `${uuidLib.v4()}`;
};

export const cleanString = (input: string): string => {
  // Replace multiple spaces with a single space
  let cleaned = input.replace(/\s\s+/g, ' ');

  // Replace multiple line breaks with a single line break
  cleaned = cleaned.replace(/\n+/g, '\n');

  return cleaned;
};

export const removeLineBreaks = (input: string): string => {
  if (!input) {
    return '';
  }
  return cleanString(input.replace(/\n/g, ' '));
};

export const toast = (message: string) => {
  Toast.show(message, {
    duration: Toast.durations.LONG,
    position: Toast.positions.TOP,
    shadow: false,
    hideOnPress: true,
    animation: true,
    containerStyle: {
      opacity: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderRadius: 4,
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isTask(obj: any): obj is Task {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.priority === 'number' &&
    Array.isArray(obj.tasks) &&
    obj.tasks.every((task: unknown) => typeof task === 'string') &&
    (obj.threadId === undefined || typeof obj.threadId === 'string') &&
    typeof obj.createdAt === 'number' &&
    (obj.dueDate === undefined || typeof obj.dueDate === 'number') &&
    typeof obj.isCompleted === 'boolean' &&
    (obj.color === undefined || typeof obj.color === 'string') &&
    Array.isArray(obj.reminders) &&
    // obj.reminders.every((reminder: unknown) => typeof reminder === 'number') &&
    (obj.parentId === undefined || typeof obj.parentId === 'string')
  );
}

export function UTC() {
  const date = new Date();
  const now_utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );

  return new Date(now_utc);
}

/**
 *
 * @param oldDate old date to get the time from
 * @param newDate new date to set the time to
 * @returns Date with the time from oldDate and the date from newDate
 */
export function updateDateKeepingTime(oldDate: Date, newDate: Date): Date {
  newDate.setHours(oldDate.getHours());
  newDate.setMinutes(oldDate.getMinutes());
  newDate.setSeconds(oldDate.getSeconds());
  return newDate;
}

export function dateStringToDateWithCurrentTime(dateString?: string): Date {
  if (!dateString) {
    return new Date();
  }
  // Parse the date string
  const [year, month, day] = dateString.split('-').map(Number);

  // Get the current time
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  // Create a new Date object with the parsed date and current time
  return new Date(year, month - 1, day, hours, minutes, seconds, milliseconds);
}
