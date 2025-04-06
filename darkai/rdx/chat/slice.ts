import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ChatMessage } from '@/types';

interface Chat {
  id: string;
  title: string;
  threadId?: string;
  updatedAt: string;
  messages: ChatMessage[];
}
export interface ChatState {
  chatsMap: Record<string, Chat>;
  isBotTyping: boolean;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  hasMoreMessages: boolean;
}

const initialState: ChatState = {
  chatsMap: {
    '111': {
      id: '111',
      title: 'Chat 1',
      messages: [],
      updatedAt: new Date().toISOString(),
    },
    '222': {
      id: '222',
      title: 'Chat 2',
      messages: [],
      updatedAt: new Date().toISOString(),
    },
    '333': {
      id: '333',
      title: 'Chat 3',
      messages: [],
      updatedAt: new Date().toISOString(),
    },
  },
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
  },
});

export const chatReducer = chatSlice.reducer;

export const {
  pushMessage,
  setIsBotTyping,
  resetChatState,
  setIsLoading,
  updateThreadId,
} = chatSlice.actions;
