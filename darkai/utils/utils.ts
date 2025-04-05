import { default as uuidLib } from 'react-native-uuid';

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const uuid = () => {
  return `${uuidLib.v4()}`;
};

export function floatToDecimal(value: number, decimal: number): number {
  return Math.round(value * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

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

export function logJson(json: unknown) {
  console.log(JSON.stringify(json, null, 2));
}
