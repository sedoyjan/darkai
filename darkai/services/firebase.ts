import {
  getAnalytics,
  setUserId as analyticsSetUserId,
} from '@react-native-firebase/analytics';
import { getApps, initializeApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import {
  getCrashlytics,
  recordError as crashlyticsRecordError,
  setUserId as crashlyticsSetUserId,
} from '@react-native-firebase/crashlytics';
import { getMessaging } from '@react-native-firebase/messaging';

import firebaseConfig from '@/firebaseConfig.json';

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const fbAuth = getAuth();
export const messaging = getMessaging();
export const analytics = getAnalytics();
export const crashlytics = getCrashlytics();

export const setUserId = async (userId: string) => {
  crashlyticsSetUserId(crashlytics, userId);
  analyticsSetUserId(analytics, userId);
};

export const recordError = (error: Error) => {
  crashlyticsRecordError(crashlytics, error);
};
