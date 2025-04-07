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

export const selectIsChatDisabled = createSelector(
  [selectHasActiveSubscription, selectHasFreeRequests, selectIsAuthenticated],
  (hasActiveSubscription, hasFreeRequests, isAuthenticated) => {
    return !hasActiveSubscription && !hasFreeRequests && isAuthenticated;
  },
);

export const makeSelectChatMessages = () =>
  createSelector(
    [
      (state: RootState, chatId: string) =>
        selectMessagesByChatId(state, chatId),
      (state: RootState, chatId: string) => selectIsBotTyping(state, chatId),
      (state: RootState, chatId: string) => selectIsLoading(state, chatId),
      selectIsChatDisabled,
      (_state: RootState, chatId: string) => chatId,
    ],
    (messages, isBotTyping, isLoading, isChatDisabled, chatId) => {
      const mergedMessages = [...messages];

      if (isChatDisabled && !isLoading) {
        mergedMessages.unshift({
          id: `out-of-free-messages-${chatId}`,
          text: 'out-of-free-messages',
          type: ChatMessageType.BOT,
          createdAt: new Date().toISOString(),
          userId: 'bot',
          chatId,
        });
      }

      if (isBotTyping) {
        mergedMessages.unshift({
          id: `bot-typing-${chatId}`,
          text: 'bot-typing',
          type: ChatMessageType.BOT,
          createdAt: new Date().toISOString(),
          userId: 'bot',
          chatId,
        });
      }

      if (!mergedMessages.length) {
        mergedMessages.unshift({
          id: `no-messages-${chatId}`,
          text: 'no-messages',
          type: ChatMessageType.BOT,
          createdAt: new Date().toISOString(),
          userId: 'bot',
          chatId,
        });
      }

      return mergedMessages;
    },
  );

const NO_CHATS: Chat[] = [];
export const selectChats = (state: RootState) => {
  const chats = Object.values(state.chat.chatsMap).sort((chatA, chatB) => {
    return (
      new Date(chatB.updatedAt).getTime() - new Date(chatA.updatedAt).getTime()
    );
  });
  return chats.length ? chats : NO_CHATS;
};

export const selectAreChatsLoading = (state: RootState) =>
  [RequestState.waiting, RequestState.unset].includes(
    state.chat.getChatsRequestState,
  );

export const selectChatListHash = (state: RootState) => {
  return Object.values(state.chat.chatsMap)
    .map(chat => chat.updatedAt)
    .join(',');
};
