import { createSelector } from '@reduxjs/toolkit';

import { ChatMessage, ChatMessageType } from '@/types';

import { RootState } from '..';
import {
  selectHasActiveSubscription,
  selectHasFreeRequests,
  selectIsAuthenticated,
} from '../app/selectors';

const NO_MESSAGES: ChatMessage[] = [];
export const selectMessagesByChatId = (state: RootState, chatId: string) => {
  return state.chat.chatsMap[chatId]?.messages || NO_MESSAGES;
};

export const selectIsBotTyping = (state: RootState) => state.chat.isBotTyping;

export const selectIsLoading = (state: RootState) => state.chat.isLoading;

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
      selectIsBotTyping,
      selectIsChatDisabled,
      selectIsLoading,
      (_state: RootState, chatId: string) => chatId,
    ],
    (messages, isBotTyping, isChatDisabled, isLoading, chatId) => {
      const mergedMessages = [...messages];

      if (isChatDisabled && !isLoading) {
        mergedMessages.unshift({
          id: `out-of-free-messages-${chatId}`,
          text: 'out-of-free-messages',
          type: ChatMessageType.BOT,
          createdAt: new Date().toISOString(),
          imageUrl: '',
          userId: 'bot',
        });
      }

      if (isBotTyping) {
        mergedMessages.unshift({
          id: `bot-typing-${chatId}`,
          text: 'bot-typing',
          type: ChatMessageType.BOT,
          createdAt: new Date().toISOString(),
          imageUrl: '',
          userId: 'bot',
        });
      }

      if (!mergedMessages.length) {
        mergedMessages.unshift({
          id: `no-messages-${chatId}`,
          text: 'no-messages',
          type: ChatMessageType.BOT,
          createdAt: new Date().toISOString(),
          imageUrl: '',
          userId: 'bot',
        });
      }

      return mergedMessages;
    },
  );

export const selectChats = (state: RootState) => {
  console.log('selectChats', state.chat.chatsMap);
  return Object.values(state.chat.chatsMap).sort((chatA, chatB) => {
    return (
      new Date(chatB.updatedAt).getTime() - new Date(chatA.updatedAt).getTime()
    );
  });
};

export const selectCurrentPage = (state: RootState) => state.chat.currentPage;
export const selectTotalPages = (state: RootState) => state.chat.currentPage;
export const selectTotalMessages = (state: RootState) => state.chat.currentPage;
export const selectIsChatLoading = (state: RootState) => state.chat.isLoading;
export const selectHasMoreMessages = (state: RootState) =>
  state.chat.hasMoreMessages;
