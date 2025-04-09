import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Chat, ChatMessage, RequestState } from '@/types';

interface ChatsParams {
  isTyping: boolean;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  hasMoreMessages: boolean;
  error?: string;
}

const initialChatsParams: ChatsParams = {
  isTyping: false,
  isLoading: false,
  currentPage: 0,
  totalPages: 0,
  hasMoreMessages: false,
};

export interface ChatState {
  chatsParamsMap: Record<string, ChatsParams>;
  chatsMap: Record<string, Chat>;
  getChatsRequestState: RequestState;
}

const initialState: ChatState = {
  chatsParamsMap: {},
  chatsMap: {},
  getChatsRequestState: RequestState.unset,
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
      const { chatId, message } = action.payload;
      const chat = state.chatsMap[chatId];
      if (chat) {
        chat.messages.unshift(message);
        chat.updatedAt = new Date().toISOString();
      } else {
        state.chatsMap[chatId] = {
          id: chatId,
          title: message.text || 'New Chat',
          messages: [message],
          updatedAt: new Date().toISOString(),
        };
      }
    },

    setIsBotTyping: (
      state,
      action: PayloadAction<{ chatId: string; isTyping: boolean }>,
    ) => {
      const { chatId, isTyping } = action.payload;
      state.chatsParamsMap[chatId] = {
        ...(state.chatsParamsMap[chatId] || initialChatsParams),
        isTyping,
      };
    },

    setIsLoading: (
      state,
      action: PayloadAction<{ chatId: string; isLoading: boolean }>,
    ) => {
      const { chatId, isLoading } = action.payload;
      state.chatsParamsMap[chatId] = {
        ...(state.chatsParamsMap[chatId] || initialChatsParams),
        isLoading,
      };
    },

    setError: (
      state,
      action: PayloadAction<{ chatId: string; error?: string }>,
    ) => {
      const { chatId, error } = action.payload;
      state.chatsParamsMap[chatId] = {
        ...(state.chatsParamsMap[chatId] || initialChatsParams),
        error,
      };
    },

    setChatsArrayToMap: (
      state,
      action: PayloadAction<{ chatsArray: Chat[] }>,
    ) => {
      const chatsArray = action.payload.chatsArray;
      const storedCopy = { ...state.chatsMap };
      state.chatsMap = {};
      chatsArray.forEach(chat => {
        const existingMesages =
          storedCopy[chat.id]?.messages || chat.messages || [];
        state.chatsMap[chat.id] = {
          ...chat,
          messages: existingMesages,
        };
      });
      state.getChatsRequestState = RequestState.success;
    },

    setGetChatsRequestState: (
      state,
      action: PayloadAction<{ requestState: RequestState }>,
    ) => {
      state.getChatsRequestState = action.payload.requestState;
    },

    setMessagesByChatId: (
      state,
      action: PayloadAction<{
        chatId: string;
        messages: ChatMessage[];
        page: number;
        totalPages: number;
        shouldKeepExisting?: boolean;
      }>,
    ) => {
      const {
        chatId,
        messages,
        page,
        totalPages,
        shouldKeepExisting = false,
      } = action.payload;
      const chat = state.chatsMap[chatId];

      state.chatsParamsMap[chatId] = {
        ...(state.chatsParamsMap[chatId] || initialChatsParams),
        currentPage: page,
        totalPages,
        hasMoreMessages: page < totalPages,
        isLoading: false,
        error: undefined,
      };

      if (chat) {
        if (shouldKeepExisting && page > 1) {
          chat.messages = Array.from(
            new Map(
              [...chat.messages, ...messages].map(m => [m.id, m]),
            ).values(),
          );
        } else {
          chat.messages = messages;
        }
        chat.updatedAt = new Date().toISOString();
      } else {
        state.chatsMap[chatId] = {
          id: chatId,
          title:
            messages.length > 0 ? messages[0].text.slice(0, 30) : 'New Chat',
          messages,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    renameChat: (
      state,
      action: PayloadAction<{ chatId: string; newTitle: string }>,
    ) => {
      const { chatId, newTitle } = action.payload;
      const chat = state.chatsMap[chatId];
      if (chat) {
        chat.title = newTitle;
        chat.updatedAt = new Date().toISOString();
      }
    },

    deleteChat: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      delete state.chatsMap[chatId];
      delete state.chatsParamsMap[chatId];
    },

    deleteAllChats: state => {
      state.chatsMap = {};
      state.chatsParamsMap = {};
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
  setError,
  renameChat,
  deleteChat,
  deleteAllChats,
  setGetChatsRequestState,
} = chatSlice.actions;
