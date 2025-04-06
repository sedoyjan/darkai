import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Chat, ChatMessage } from '@/types';

interface ChatsParams {
  isTyping: boolean;
  isLoading: boolean;
}

const initialChatsParams: ChatsParams = {
  isTyping: false,
  isLoading: false,
};
export interface ChatState {
  chatsParamsMap: Record<string, ChatsParams>;
  chatsMap: Record<string, Chat>;
  currentPage: number;
  totalPages: number;
  hasMoreMessages: boolean;
}

const initialState: ChatState = {
  chatsParamsMap: {},
  chatsMap: {},
  currentPage: 0,
  totalPages: 0,
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

    setIsBotTyping: (
      state,
      action: PayloadAction<{ chatId: string; isTyping: boolean }>,
    ) => {
      const chatId = action.payload.chatId;
      const chat = state.chatsMap[chatId];
      if (chat) {
        state.chatsParamsMap[chatId] = {
          ...state.chatsParamsMap[chatId],
          isTyping: action.payload.isTyping,
        };
      } else {
        state.chatsParamsMap[chatId] = {
          ...initialChatsParams,
          isTyping: action.payload.isTyping,
        };
      }
    },

    setIsLoading: (
      state,
      action: PayloadAction<{ chatId: string; isLoading: boolean }>,
    ) => {
      const chatId = action.payload.chatId;
      const chat = state.chatsMap[chatId];
      if (chat) {
        state.chatsParamsMap[chatId] = {
          ...state.chatsParamsMap[chatId],
          isLoading: action.payload.isLoading,
        };
      } else {
        state.chatsParamsMap[chatId] = {
          isTyping: false,
          isLoading: action.payload.isLoading,
        };
      }
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
