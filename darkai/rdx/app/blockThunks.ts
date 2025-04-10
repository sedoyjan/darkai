import { createAsyncThunk } from '@reduxjs/toolkit';
import { getLocales } from 'expo-localization';

import { apiClient } from '@/api';
import i18n, { LangKey, LANGUAGE_CODES } from '@/i18n';
import { recordError } from '@/services/firebase';
import { checkSubscription, configurePurchases } from '@/services/purchases';

import { RootState } from '..';
import { selectIsDeveloper, selectLanguageCode } from './selectors';
import {
  setFcmToken,
  setHasActiveSubscription,
  setHasFreeRequests,
  setLocale,
} from './slice';

export const updateFcmTokenThunk = createAsyncThunk<
  void,
  { fcmToken: string },
  { state: RootState }
>('app/updateFcmTokenThunk', async ({ fcmToken }, { dispatch }) => {
  dispatch(setFcmToken({ fcmToken }));
  try {
    await apiClient.postUserUserUpdateFcmToken({ fcmToken });
  } catch (error) {
    console.error('Failed to update FCM token on backend:', error);
    recordError(error as Error);
  }
});

export const localeConfigThunk = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>('app/localeConfigThunk', async (_, { dispatch, getState }) => {
  const locales = getLocales();
  const locale = locales[0];
  const storedLanguageCode = selectLanguageCode(getState());
  const languageCode = (locale.languageCode || 'en') as LangKey;
  if (locale) {
    dispatch(setLocale({ locale }));
    if (storedLanguageCode) {
      i18n.changeLanguage(storedLanguageCode);
    } else if (LANGUAGE_CODES.includes(languageCode)) {
      i18n.changeLanguage(languageCode);
    }
  }
});

export const getUserDataThunk = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>('app/getUserData', async (_, { dispatch }) => {
  try {
    const { data } = await apiClient.getUserMe();
    dispatch(setHasFreeRequests({ hasFreeRequests: data.hasFreeRequests }));
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    recordError(error as Error);
  }
});

export const setupPurchasesAndSubscription = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>('app/setupPurchases', async (_, { dispatch, getState }) => {
  const isDeveloper = selectIsDeveloper(getState());

  await configurePurchases();
  if (!isDeveloper) {
    const hasActiveSubscription = await checkSubscription();
    dispatch(setHasActiveSubscription({ hasActiveSubscription }));
  }
});
