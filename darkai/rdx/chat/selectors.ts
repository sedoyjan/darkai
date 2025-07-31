import { createSelector } from '@reduxjs/toolkit';

import { Chat, ChatMessage, ChatMessageType, RequestState } from '@/types';

import { RootState } from '..';
import {
  selectHasActiveSubscription,
  selectHasFreeRequests,
  selectIsAuthenticated,
} from '../app/selectors';

export const selectChatById = (state: RootState, chatId: string) => {
  return state.chat.chatsMap[chatId];
};

export const selectIsChatInStoreById = (state: RootState, chatId: string) => {
  return !!state.chat.chatsMap[chatId];
};

export const selectChatTitleById = (state: RootState, chatId: string) => {
  return state.chat.chatsMap[chatId]?.title || '';
};

const NO_MESSAGES: ChatMessage[] = [];
export const selectMessagesByChatId = (state: RootState, chatId: string) => {
  return state.chat.chatsMap[chatId]?.messages || NO_MESSAGES;
};

export const selectIsBotTyping = (state: RootState, chatId: string) => {
  return state.chat.chatsParamsMap[chatId]?.isTyping || false;
};

export const selectIsLoading = (state: RootState, chatId: string) => {
  return state.chat.chatsParamsMap[chatId]?.isLoading || false;
};

export const selectIsQuiteLoading = (state: RootState) => {
  return state.chat.isQuiteLoading;
};

export const selectIsChatDisabled = createSelector(
  [selectHasActiveSubscription, selectHasFreeRequests, selectIsAuthenticated],
  (hasActiveSubscription, hasFreeRequests, isAuthenticated) => {
    return !hasActiveSubscription && !hasFreeRequests && isAuthenticated;
  },
);

// Memoized selector factory for chat messages with optimized object creation
export const makeSelectChatMessages = () => {
  // Cache for system messages to avoid recreating them
  const systemMessagesCache = new Map<string, ChatMessage>();

  const getSystemMessage = (type: string, chatId: string): ChatMessage => {
    const key = `${type}-${chatId}`;
    if (!systemMessagesCache.has(key)) {
      systemMessagesCache.set(key, {
        id: key,
        text: type,
        type: ChatMessageType.BOT,
        createdAt: new Date().toISOString(),
        userId: 'bot',
        chatId,
      });
    }
    return systemMessagesCache.get(key)!;
  };

  return createSelector(
    [
      (state: RootState, chatId: string) =>
        selectMessagesByChatId(state, chatId),
      (state: RootState, chatId: string) => selectIsBotTyping(state, chatId),
      (state: RootState, chatId: string) => selectIsLoading(state, chatId),
      selectIsChatDisabled,
      (_state: RootState, chatId: string) => chatId,
    ],
    (messages, isBotTyping, isLoading, isChatDisabled, chatId) => {
      // Start with existing messages array - no need to spread if nothing to add
      let mergedMessages = messages;
      const additions: ChatMessage[] = [];

      if (isChatDisabled && !isLoading) {
        additions.push(getSystemMessage('out-of-free-messages', chatId));
      }

      if (isBotTyping) {
        additions.push(getSystemMessage('bot-typing', chatId));
      }

      if (!messages.length && !isLoading) {
        additions.push(getSystemMessage('no-messages', chatId));
      }

      // Only create new array if we have additions
      if (additions.length > 0) {
        mergedMessages = [...additions, ...messages];
      }

      return mergedMessages;
    },
  );
};

const NO_CHATS: Chat[] = [];

// Optimized and memoized chat selector
export const selectChats = createSelector(
  [(state: RootState) => state.chat.chatsMap],
  chatsMap => {
    const chats = Object.values(chatsMap);
    if (chats.length === 0) return NO_CHATS;

    return chats.sort(
      (chatA, chatB) =>
        new Date(chatB.updatedAt).getTime() -
        new Date(chatA.updatedAt).getTime(),
    );
  },
);

export const selectAreChatsLoading = (state: RootState) =>
  [RequestState.waiting, RequestState.unset].includes(
    state.chat.getChatsRequestState,
  );

export const selectChatListHash = createSelector(
  [(state: RootState) => state.chat.chatsMap],
  chatsMap => {
    return Object.values(chatsMap)
      .map(chat => chat.updatedAt)
      .join(',');
  },
);
