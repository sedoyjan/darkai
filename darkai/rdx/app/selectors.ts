import { createSelector } from 'reselect';

import { DEVELOPER_EMAILS } from '@/const';

import { RootState } from '..';

export const selectUser = (state: RootState) => state.app.user;
export const selectIsAuthenticated = (state: RootState) => !!state.app.user;
export const selectFcmToken = (state: RootState) => state.app.fcmToken;
export const selectIdentityToken = (state: RootState) =>
  state.app.identityToken;
export const selectHasActiveSubscription = (state: RootState) =>
  state.app.hasActiveSubscription;
export const selectSubscriptionProduct = (state: RootState) =>
  state.app.product;
export const selectPaymentDiscount = (state: RootState) =>
  state.app.paymentDiscount;
export const selectIsSubscriptionFlowInProgress = (state: RootState) =>
  state.app.isSubscriptionFlowInProgress;
export const selectIsSignInFlowInProgress = (state: RootState) =>
  state.app.isSignInFlowInProgress;
export const selectLanguageCode = (state: RootState) => state.app.languageCode;
export const selectLocale = (state: RootState) => state.app.locale;

export const selectIsDeveloper = createSelector([selectUser], user => {
  return (user?.email && DEVELOPER_EMAILS.includes(user?.email)) || __DEV__;
});

export const selectPromoQuestions = (state: RootState) =>
  state.app.promoQuestions;

export const selectIsRecordingMode = (state: RootState) =>
  state.app.isRecordingMode;

export const selectCalendar = (state: RootState) => state.app.calendar;
export const selectLaunchCount = (state: RootState) => state.app.launchCount;
export const selectIsOnboardingPassed = (state: RootState) =>
  state.app.isOnboardingPassed;
export const selectIsOnboardingSkipped = (state: RootState) =>
  state.app.isOnboardingSkipped;
export const selectHasFreeRequests = (state: RootState) =>
  state.app.hasFreeRequests;
