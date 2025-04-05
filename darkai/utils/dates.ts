import { format, formatDistance as formatDistanceLib } from 'date-fns';

import { DATE_LOCALES, getLanguage } from '@/i18n';

export const formatDistance = (timestamp: number | string) => {
  const language = getLanguage();

  return formatDistanceLib(new Date(timestamp), new Date(), {
    addSuffix: true,
    locale: DATE_LOCALES[language],
  });
};

export const getMessageTime = (createdAt: string) => {
  const diff = new Date().getTime() - new Date(createdAt).getTime();
  if (diff > 1000 * 60 * 5) {
    return format(new Date(createdAt), 'HH:mm');
  }

  return formatDistance(createdAt);
};

export function getFixedTimeDate(
  hours: number,
  minutes: number = 0,
  seconds: number = 0,
  milliseconds: number = 0,
): Date {
  const currentDate = new Date(); // Get the current date
  currentDate.setHours(hours, minutes, seconds, milliseconds); // Set the fixed time

  return currentDate;
}

export function getTimezoneOffsetHours(): number {
  // Get the current date
  const currentDate = new Date();

  // Get the timezone offset in minutes
  const timezoneOffset = currentDate.getTimezoneOffset();

  return timezoneOffset / 60;
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}
