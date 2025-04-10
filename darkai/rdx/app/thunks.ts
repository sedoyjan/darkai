import auth from '@react-native-firebase/auth';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  AppleAuthenticationScope,
  signInAsync,
} from 'expo-apple-authentication';
import { Href } from 'expo-router';
import Purchases from 'react-native-purchases';

import { apiClient } from '@/api';
import { IS_DEV } from '@/const';
import { analytics, fbAuth, messaging, recordError } from '@/services/firebase';
import { configurePurchases } from '@/services/purchases';
import { sharedRouter } from '@/services/sharedRouter';
import { User } from '@/types';

import { RootState } from '..';
import { getChatsThunk } from '../chat/thunks';
import {
  getUserDataThunk,
  localeConfigThunk,
  setFcmTokenThunk,
  setupPurchasesAndSubscription,
} from './blockThunks';
import { selectFcmToken, selectLaunchCount, selectUser } from './selectors';
import {
  setIdentityToken,
  setIsSignInFlowInProgress,
  setLaunchCount,
  setUser,
} from './slice';

export const setUserOnServerThunk = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>('app/setUserOnServerThunk', async (_, { getState }) => {
  const state = getState();
  const user = selectUser(state);
  if (!user) {
    console.error('No user found');
    return;
  }

  const fcmToken = selectFcmToken(state) || '';
  const { isConfigured } = await configurePurchases();
  const appUserId = isConfigured ? await Purchases.getAppUserID() : '';

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
      method: user.isAnonymous ? 'anonymous' : 'apple',
    });
  } catch (error) {
    console.error('Post login sync failed:', error);
    recordError(error as Error);
  }
});

export const setupMessagingThunk = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>('app/setupMessagingThunk', async (_, { dispatch }) => {
  try {
    await messaging.requestPermission();
    const token = await messaging.getToken();

    dispatch(setFcmTokenThunk({ fcmToken: token }));
    messaging.onTokenRefresh(newToken => {
      dispatch(setFcmTokenThunk({ fcmToken: newToken }));
    });
  } catch (error) {
    console.error('Messaging setup failed:', error);
    recordError(error as Error);
  }
});

export const signInAnonymouslyThunk = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('app/signInAnonymously', async (_, { dispatch }) => {
  dispatch(setIsSignInFlowInProgress({ isSignInFlowInProgress: true }));
  try {
    const fbCredential = await fbAuth.signInAnonymously();
    const idToken = await fbAuth.currentUser?.getIdToken(true);

    if (fbCredential && idToken) {
      dispatch(setIdentityToken({ identityToken: idToken }));
      const user = fbCredential.user.toJSON() as User;
      dispatch(setUser({ user }));
      await dispatch(setUserOnServerThunk()).unwrap();
    }
  } catch (error) {
    console.error('Anonymous sign-in failed:', error);
    recordError(error as Error);
  } finally {
    dispatch(setIsSignInFlowInProgress({ isSignInFlowInProgress: false }));
  }
});

export const signInWithAppleThunk = createAsyncThunk<
  void,
  { redirectScreen?: string },
  { state: RootState }
>('app/signInWithApple', async ({ redirectScreen }, { dispatch }) => {
  dispatch(setIsSignInFlowInProgress({ isSignInFlowInProgress: true }));
  try {
    const credential = await signInAsync({
      requestedScopes: [
        AppleAuthenticationScope.FULL_NAME,
        AppleAuthenticationScope.EMAIL,
      ],
    });

    const appleCredential = auth.AppleAuthProvider.credential(
      credential.identityToken,
    );
    const fbCredential = await fbAuth.signInWithCredential(appleCredential);
    const idToken = await fbAuth.currentUser?.getIdToken(true);

    if (fbCredential && idToken) {
      dispatch(setIdentityToken({ identityToken: idToken }));
      const user = fbCredential.user.toJSON() as User;
      dispatch(setUser({ user }));
      await dispatch(setUserOnServerThunk()).unwrap();

      if (redirectScreen) {
        sharedRouter.getRouter().replace(redirectScreen as Href);
      }
    }
  } catch (error) {
    console.error('Apple sign-in failed:', error);
    recordError(error as Error);
  } finally {
    dispatch(setIsSignInFlowInProgress({ isSignInFlowInProgress: false }));
  }
});

export const signOutThunk = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>('app/signOutThunk', async (_, { dispatch }) => {
  try {
    await fbAuth.signOut();
  } catch (error) {
    console.error('Sign out failed:', error);
    recordError(error as Error);
  }
  dispatch(setUser({ user: null }));
  dispatch(setIdentityToken({ identityToken: null }));
});

export const deleteAccountThunk = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>('app/deleteAccount', async (_, { dispatch }) => {
  try {
    await apiClient.postUserDeleteAccount();
    dispatch(setIdentityToken({ identityToken: null }));
    await dispatch(signOutThunk()).unwrap();
  } catch (error) {
    console.error('Delete account failed:', error);
    recordError(error as Error);
  }
});

export const initThunk = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>('app/initThunk', async (_, { dispatch, getState }) => {
  const initialState = getState();

  dispatch(setLaunchCount({ count: selectLaunchCount(initialState) + 1 }));
  dispatch(localeConfigThunk());
  if (!IS_DEV) {
    apiClient.postAnalyticsLaunch({});
  }

  const firebaseUser = await new Promise<User | null>(resolve => {
    const unsubscribe = fbAuth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    });
  });

  if (!firebaseUser) {
    await dispatch(signInAnonymouslyThunk()).unwrap();
  } else {
    const idToken = await fbAuth.currentUser?.getIdToken(true);
    if (!idToken) {
      console.error('No ID token found for existing user');
      return;
    }
    dispatch(setIdentityToken({ identityToken: idToken }));
    dispatch(
      setUser({
        user: firebaseUser.toJSON() as User,
      }),
    );
  }
  await dispatch(setUserOnServerThunk()).unwrap();

  await Promise.all([
    dispatch(setupPurchasesAndSubscription()),
    dispatch(getUserDataThunk()),
    dispatch(getChatsThunk()),
  ]);
});
