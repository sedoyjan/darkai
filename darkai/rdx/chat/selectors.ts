import { createSelector } from '@reduxjs/toolkit';

import { ChatMessageType } from '@/types';

import { RootState } from '..';
import {
  selectHasActiveSubscription,
  selectHasFreeRequests,
  selectIsAuthenticated,
} from '../app/selectors';

export const selectMessages = (state: RootState) => state.chat.messages;
export const selectIsBotTyping = (state: RootState) => state.chat.isBotTyping;
export const selectIsLoading = (state: RootState) => state.chat.isLoading;

export const selectIsChatDisabled = createSelector(
  [selectHasActiveSubscription, selectHasFreeRequests, selectIsAuthenticated],
  (hasActiveSubscription, hasFreeRequests, isAuthenticated) => {
    return !hasActiveSubscription && !hasFreeRequests && isAuthenticated;
  },
);

export const selectChatMessages = createSelector(
  [selectMessages, selectIsBotTyping, selectIsChatDisabled, selectIsLoading],
  (messages, isBotTyping, isChatDisabled, isLoading) => {
    const mergedMessages = [...messages];

    if (isChatDisabled && !isLoading) {
      mergedMessages.unshift({
        id: 'out-of-free-messages',
        text: 'out-of-free-messages',
        type: ChatMessageType.BOT,
        createdAt: new Date().toISOString(),
        imageUrl: '',
        userId: 'bot',
      });
    }

    if (isBotTyping) {
      mergedMessages.unshift({
        id: 'bot-typing',
        text: 'bot-typing',
        type: ChatMessageType.BOT,
        createdAt: new Date().toISOString(),
        imageUrl: '',
        userId: 'bot',
      });
    }

    if (!mergedMessages.length) {
      mergedMessages.unshift({
        id: 'no-messages',
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

export const selectCurrentPage = (state: RootState) => state.chat.currentPage;
export const selectTotalPages = (state: RootState) => state.chat.currentPage;
export const selectTotalMessages = (state: RootState) => state.chat.currentPage;
export const selectIsChatLoading = (state: RootState) => state.chat.isLoading;
export const selectHasMoreMessages = (state: RootState) =>
  state.chat.hasMoreMessages;
