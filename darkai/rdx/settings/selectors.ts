import { RootState } from '..';

export const selectUserTriedAi = (state: RootState) =>
  state.settings.userTriedAi;

export const selectIsPrivacyAccepted = (state: RootState) =>
  state.settings.isPrivacyAccepted;

export const selectIsTermsAccepted = (state: RootState) =>
  state.settings.isTermsAccepted;

export const selectKeyboardHeight = (state: RootState) =>
  state.settings.keyboardHeight;

export const selectShowCompletedTasks = (state: RootState) =>
  state.settings.showCompletedTasks;
