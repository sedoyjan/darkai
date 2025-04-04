import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  familyName: string;
  givenName: string;
  email: string | null;
  isLoggedIn: boolean;
  usedId?: string;
  userTriedAi: boolean;
  isTermsAccepted: boolean;
  isPrivacyAccepted: boolean;
  keyboardHeight: number;
  showCompletedTasks: boolean;
}

const initialState: SettingsState = {
  keyboardHeight: 0,
  familyName: '',
  givenName: '',
  email: null,
  isLoggedIn: false,
  usedId: undefined,
  userTriedAi: false,
  isPrivacyAccepted: false,
  isTermsAccepted: false,
  // local settings
  showCompletedTasks: true,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setKeyboardHeight: (state, action: PayloadAction<number>) => {
      state.keyboardHeight = action.payload;
    },
    setUserTriedAi: state => {
      state.userTriedAi = true;
    },
    setIsPrivacyAccepted: (state, action: PayloadAction<boolean>) => {
      state.isPrivacyAccepted = action.payload;
    },
    setIsTermsAccepted: (state, action: PayloadAction<boolean>) => {
      state.isTermsAccepted = action.payload;
    },
    setShowCompletedTasks: (state, action: PayloadAction<boolean>) => {
      state.showCompletedTasks = action.payload;
    },
  },
});

export const settingsReducer = settingsSlice.reducer;

export const {
  setUserTriedAi,
  setIsPrivacyAccepted,
  setIsTermsAccepted,
  setKeyboardHeight,
  setShowCompletedTasks,
} = settingsSlice.actions;
