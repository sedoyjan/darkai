import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  AppleAuthenticationScope,
  signInAsync,
} from 'expo-apple-authentication';
import { getLocales } from 'expo-localization';
import Purchases from 'react-native-purchases';

import { apiClient } from '@/api';
import { IS_DEV } from '@/const';
import i18n, { LangKey, LANGUAGE_CODES } from '@/i18n';
import {
  analytics,
  fbAuth,
  messaging,
  recordError,
  setUserId,
} from '@/services/firebase';
import { checkSubscription, configurePurchases } from '@/services/purchases';
import { sharedRouter } from '@/services/sharedRouter';
import { User } from '@/types';

import { RootState } from '..';
import { getChatsThunk } from '../chat/thunks';
import {
  selectFcmToken,
  selectHasActiveSubscription,
  selectIsDeveloper,
  selectIsOnboardingPassed,
  selectIsOnboardingSkipped,
  selectLanguageCode,
  selectLaunchCount,
  selectUser,
} from './selectors';
import {
  setFcmToken,
  setHasActiveSubscription,
  setHasFreeRequests,
  setIdentityToken,
  setIsSignInFlowInProgress,
  setLaunchCount,
  setLocale,
  setUser,
} from './slice';

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
    } else {
      if (LANGUAGE_CODES.includes(languageCode)) {
        i18n.changeLanguage(languageCode);
      }
    }
  }
});

export const postUserLoginThunk = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>('app/postUserLoginThunk', async (_, { getState }) => {
  const state = getState();
  const { isConfigured } = await configurePurchases();

  const fcmToken = selectFcmToken(state) || '';
  const user = selectUser(state);
  const appUserId = isConfigured ? await Purchases.getAppUserID() : '';

  if (!user) {
    console.error('postUserLoginThunk: user is not defined');
    return;
  }

  try {
    await apiClient.postUserLogin({
      appUserId,
      fcmToken,
      identityToken: '',
      email: user.providerData[0]?.email || '',
      uid: user.uid,
      locale: state.app.locale?.languageCode || '',
    });
    analytics.logLogin({
      method: 'apple',
    });
  } catch (error) {
    console.error('postUserLogin error', error);
  }
});

export const initThunk = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>('app/initThunk', async (_, { dispatch, getState }) => {
  console.log('🚀 ~ > ~ initThunk:');
  const initialState = getState();
  const isDeveloper = selectIsDeveloper(initialState);

  dispatch(setLaunchCount({ count: selectLaunchCount(initialState) + 1 }));
  dispatch(localeConfigThunk());

  if (!IS_DEV) {
    try {
      apiClient.postAnalyticsLaunch({});
    } catch (error) {
      console.warn('initThunk error', error);
    }
  }

  try {
    await configurePurchases();
  } catch (error) {
    console.error('configurePurchases error', error);
  }

  if (!isDeveloper) {
    try {
      const hasActiveSubscription = await checkSubscription();
      dispatch(setHasActiveSubscription({ hasActiveSubscription }));
    } catch (error) {
      console.warn('checkSubscription error', error);
    }
  }

  try {
    await messaging.requestPermission();
    const token = await messaging.getToken();

    messaging.onTokenRefresh(newToken => {
      dispatch(setFcmToken({ fcmToken: newToken }));
    });

    dispatch(setFcmToken({ fcmToken: token }));
  } catch (error) {
    console.error('messaging.getToken error', error);
    recordError(error as Error);
  }

  const user = selectUser(getState());
  console.log('🚀 ~ > ~ user:', user);
  if (!user) {
    return;
  }

  setUserId(user.uid);

  let hasFreeRequests = false;

  try {
    const { data } = await apiClient.getUserMe();
    hasFreeRequests = data.hasFreeRequests;
  } catch (error) {
    console.error('getUserMe error', error);
  }

  dispatch(setHasFreeRequests({ value: hasFreeRequests }));
  dispatch(getChatsThunk());

  const state = getState();
  const isOnboardingPassed = selectIsOnboardingPassed(state);
  const isOnboardingSkipped = selectIsOnboardingSkipped(state);
  const launchCount = selectLaunchCount(state);
  const hasActiveSubscription = selectHasActiveSubscription(state);

  setTimeout(() => {
    if (
      !hasActiveSubscription &&
      launchCount > 1 &&
      (isOnboardingPassed || isOnboardingSkipped) &&
      !hasFreeRequests
    ) {
      sharedRouter.getRouter().push('subscriptionModal');
    }
  }, 500);
});

export const signOutThunk = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>('app/signOutThunk', async (_, { dispatch }) => {
  await fbAuth.signOut().catch(error => {
    console.error('signOutThunk error', error);
    recordError(error as Error);
  });

  dispatch(setUser({ user: null }));
  dispatch(setIdentityToken({ identityToken: null }));
});

export const deleteAccountThunk = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>('app/deleteAccount', async (_, { dispatch }) => {
  apiClient
    .postUserDeleteAccount()
    .then(() => {
      dispatch(setIdentityToken({ identityToken: null }));
      dispatch(signOutThunk());
    })
    .catch(error => {
      console.error('postUserDeleteAccount error', error);
      recordError(error as Error);
    });
});

export const signInThunk = createAsyncThunk<
  void,
  { redirectScreen?: string },
  { state: RootState }
>('app/signIn', async ({ redirectScreen }, { dispatch }) => {
  dispatch(setIsSignInFlowInProgress({ isSignInFlowInProgress: true }));
  console.log('signInThunk 1');
  try {
    const credential = await signInAsync({
      requestedScopes: [
        AppleAuthenticationScope.FULL_NAME,
        AppleAuthenticationScope.EMAIL,
      ],
    });
    console.log('signInThunk 2');

    const appleCredential = auth.AppleAuthProvider.credential(
      credential.identityToken,
    );

    let fbCredential: FirebaseAuthTypes.UserCredential | null = null;
    try {
      fbCredential = await fbAuth.signInWithCredential(appleCredential);
    } catch (error) {
      console.error('signInWithCredential error', error);
      recordError(error as Error);
    }

    const idToken = await fbAuth.currentUser?.getIdToken(true);

    if (fbCredential && idToken) {
      dispatch(setIdentityToken({ identityToken: idToken }));
      const user = fbCredential.user.toJSON() as User;

      dispatch(setUser({ user }));
      await dispatch(postUserLoginThunk());

      if (redirectScreen) {
        sharedRouter.getRouter().replace(redirectScreen);
      }
    }
  } catch (error) {
    recordError(error as Error);
    console.error(
      'An unexpected error occurred during the sign-in process',
      error,
    );
  }
  dispatch(setIsSignInFlowInProgress({ isSignInFlowInProgress: false }));
});

export const setupMessagingThunk = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>('app/setupMessagingThunk', async (_, { dispatch, getState }) => {
  try {
    await messaging.requestPermission();
    const token = await messaging.getToken();

    messaging.onTokenRefresh(newToken => {
      dispatch(setFcmToken({ fcmToken: newToken }));
    });

    dispatch(setFcmToken({ fcmToken: token }));
  } catch (error) {
    console.error('messaging.getToken error', error);
  }
});
