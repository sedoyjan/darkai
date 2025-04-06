import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Chat, ChatMessage } from '@/types';

export interface ChatState {
  chatsMap: Record<string, Chat>;
  isBotTyping: boolean;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  hasMoreMessages: boolean;
}

const initialState: ChatState = {
  chatsMap: {},
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

    updateThreadId: (
      state,
      action: PayloadAction<{ chatId: string; threadId: string }>,
    ) => {
      const { chatId, threadId } = action.payload;
      const chat = state.chatsMap[chatId];
      if (chat) {
        chat.threadId = threadId;
      }
    },

    pushMessage: (
      state,
      action: PayloadAction<{ message: ChatMessage; chatId: string }>,
    ) => {
      const chatId = action.payload.chatId;
      const chat = state.chatsMap[chatId];
      if (chat) {
        chat.messages.unshift(action.payload.message);
        chat.updatedAt = new Date().toISOString();
      } else {
        state.chatsMap[chatId] = {
          id: chatId,
          title: action.payload.message.text,
          messages: [],
          updatedAt: new Date().toISOString(),
        };
        state.chatsMap[chatId].messages.unshift(action.payload.message);
      }
    },

    setIsBotTyping: (state, action: PayloadAction<{ isTyping: boolean }>) => {
      state.isBotTyping = action.payload.isTyping;
    },

    setIsLoading: (state, action: PayloadAction<{ isLoading: boolean }>) => {
      state.isLoading = action.payload.isLoading;
    },

    setChatsArrayToMap: (
      state,
      action: PayloadAction<{ chatsArray: Chat[] }>,
    ) => {
      const chatsArray = action.payload.chatsArray;
      chatsArray.forEach(chat => {
        state.chatsMap[chat.id] = chat;
      });
    },

    setMessagesByChatId: (
      state,
      action: PayloadAction<{ chatId: string; messages: ChatMessage[] }>,
    ) => {
      const chatId = action.payload.chatId;
      const chat = state.chatsMap[chatId];
      if (chat) {
        chat.messages = action.payload.messages;
      } else {
        state.chatsMap[chatId] = {
          id: chatId,
          title: '',
          messages: action.payload.messages,
          updatedAt: new Date().toISOString(),
        };
      }
    },
  },
});

export const chatReducer = chatSlice.reducer;

export const {
  setChatsArrayToMap,
  pushMessage,
  setIsBotTyping,
  resetChatState,
  setIsLoading,
  updateThreadId,
  setMessagesByChatId,
} = chatSlice.actions;
