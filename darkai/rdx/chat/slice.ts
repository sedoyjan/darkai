import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ChatMessage } from '@/types';

export interface ChatState {
  messages: ChatMessage[];
  isBotTyping: boolean;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  hasMoreMessages: boolean;
}

const initialState: ChatState = {
  messages: [],
  isBotTyping: false,
  currentPage: 0,
  totalPages: 0,
  isLoading: false,
  hasMoreMessages: true,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetChatState: () => initialState,
    setMessages: (
      state,
      action: PayloadAction<{
        page: number;
        messages: ChatMessage[];
        hasMoreMessages: boolean;
        shouldKeepExisting: boolean;
      }>,
    ) => {
      if (action.payload.shouldKeepExisting) {
        const existingMessages = state.messages;
        state.messages = [...existingMessages, ...action.payload.messages];
      } else {
        state.messages = action.payload.messages;
      }
      state.isLoading = false;
      state.currentPage = action.payload.page;
      state.hasMoreMessages = action.payload.hasMoreMessages;
    },
    pushMessage: (state, action: PayloadAction<{ message: ChatMessage }>) => {
      state.messages.unshift(action.payload.message);
    },
    setIsBotTyping: (state, action: PayloadAction<{ isTyping: boolean }>) => {
      state.isBotTyping = action.payload.isTyping;
    },
    setIsLoading: (state, action: PayloadAction<{ isLoading: boolean }>) => {
      state.isLoading = action.payload.isLoading;
    },
  },
});

export const chatReducer = chatSlice.reducer;

export const {
  setMessages,
  pushMessage,
  setIsBotTyping,
  resetChatState,
  setIsLoading,
} = chatSlice.actions;
