import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Calendar, Locale } from 'expo-localization';
import {
  PurchasesPromotionalOffer,
  PurchasesStoreProduct,
} from 'react-native-purchases';

import { User } from '@/types';

export interface AppState {
  user: User | null;
  fcmToken: string | null;
  calendar: Calendar | null;
  locale: Locale | null;
  languageCode: string | null;
  identityToken: string | null;
  product: PurchasesStoreProduct | undefined;
  paymentDiscount: PurchasesPromotionalOffer | undefined;
  hasActiveSubscription: boolean;
  isSubscriptionFlowInProgress: boolean;
  isSignInFlowInProgress: boolean;
  promoQuestions: {
    question: string;
    prompt: string;
  }[];
  isRecordingMode: boolean;
  launchCount: number;
  isOnboardingSkipped: boolean;
  isOnboardingPassed: boolean;
  isPromoModalVisible: boolean;
  hasFreeRequests: boolean;
}

const initialState: AppState = {
  user: null,
  fcmToken: null,
  calendar: null,
  locale: null,
  languageCode: null,
  identityToken: null,
  product: undefined,
  paymentDiscount: undefined,
  hasActiveSubscription: false,
  isSubscriptionFlowInProgress: false,
  isSignInFlowInProgress: false,
  promoQuestions: [],
  isRecordingMode: false,
  launchCount: 0,
  isOnboardingSkipped: false,
  isOnboardingPassed: false,
  isPromoModalVisible: false,
  hasFreeRequests: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsSignInFlowInProgress: (
      state,
      action: PayloadAction<{ isSignInFlowInProgress: boolean }>,
    ) => {
      state.isSignInFlowInProgress = action.payload.isSignInFlowInProgress;
    },
    setIsSubscriptionFlowInProgress: (
      state,
      action: PayloadAction<{ isSubscriptionFlowInProgress: boolean }>,
    ) => {
      state.isSubscriptionFlowInProgress =
        action.payload.isSubscriptionFlowInProgress;
    },
    setHasActiveSubscription: (
      state,
      action: PayloadAction<{ hasActiveSubscription: boolean }>,
    ) => {
      state.hasActiveSubscription = action.payload.hasActiveSubscription;
    },
    setProductAndDiscount: (
      state,
      action: PayloadAction<{
        product: PurchasesStoreProduct | undefined;
        paymentDiscount: PurchasesPromotionalOffer | undefined;
      }>,
    ) => {
      state.product = action.payload.product;
      state.paymentDiscount = action.payload.paymentDiscount;
    },
    setIdentityToken: (
      state,
      action: PayloadAction<{ identityToken: string | null }>,
    ) => {
      state.identityToken = action.payload.identityToken;
    },
    setLocale: (state, action: PayloadAction<{ locale: Locale }>) => {
      state.locale = action.payload.locale;
    },
    setCalendar: (state, action: PayloadAction<{ calendar: Calendar }>) => {
      state.calendar = action.payload.calendar;
    },
    setUser: (state, action: PayloadAction<{ user: User | null }>) => {
      state.user = action.payload.user;
    },
    setFcmToken: (state, action: PayloadAction<{ fcmToken: string }>) => {
      state.fcmToken = action.payload.fcmToken;
    },
    setLanguageCode: (
      state,
      action: PayloadAction<{ languageCode: string }>,
    ) => {
      state.languageCode = action.payload.languageCode;
    },
    clearPromoQuestions: state => {
      state.promoQuestions = [];
    },
    addPromoQuestion: (
      state,
      action: PayloadAction<{ question: string; prompt: string }>,
    ) => {
      if (
        !state.promoQuestions
          .map(item => item.question)
          .includes(action.payload.question)
      ) {
        state.promoQuestions.push(action.payload);
      }
    },
    setIsRecordingMode: (
      state,
      action: PayloadAction<{ isRecordingMode: boolean }>,
    ) => {
      state.isRecordingMode = action.payload.isRecordingMode;
    },
    setLaunchCount: (state, action: PayloadAction<{ count: number }>) => {
      state.launchCount = action.payload.count;
    },
    setIsOnboardingSkipped: (
      state,
      action: PayloadAction<{ value: boolean }>,
    ) => {
      state.isOnboardingPassed = action.payload.value;
    },
    setIsOnboardingPassed: (
      state,
      action: PayloadAction<{ value: boolean }>,
    ) => {
      state.isOnboardingSkipped = action.payload.value;
    },
    setHasFreeRequests: (state, action: PayloadAction<{ value: boolean }>) => {
      state.hasFreeRequests = action.payload.value;
    },
  },
});

export const appReducer = appSlice.reducer;

export const {
  setUser,
  setFcmToken,
  setCalendar,
  setLocale,
  setIdentityToken,
  setProductAndDiscount,
  setHasActiveSubscription,
  setIsSubscriptionFlowInProgress,
  setIsSignInFlowInProgress,
  setLanguageCode,
  addPromoQuestion,
  clearPromoQuestions,
  setIsRecordingMode,
  setLaunchCount,
  setIsOnboardingSkipped,
  setIsOnboardingPassed,
  setHasFreeRequests,
} = appSlice.actions;
