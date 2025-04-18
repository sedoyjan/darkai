import { createAsyncThunk } from '@reduxjs/toolkit';
import * as Haptics from 'expo-haptics';

import { apiClient } from '@/api';
import { eventEmitter } from '@/EventEmitter';
import { ChatMessageType, RequestState } from '@/types';
import { uuid } from '@/utils';
import { delay } from '@/utils/utils';

import { RootState } from '..';
import { selectLocale, selectUser } from '../app/selectors';
import { setHasFreeRequests } from '../app/slice';
import { selectIsBotTyping, selectIsChatDisabled } from './selectors';
import {
  pushMessage,
  setChatsArrayToMap,
  setGetChatsRequestState,
  setIsBotTyping,
  setIsLoading,
  setMessagesByChatId,
  updateThreadId,
} from './slice';

export const getMessagesThunk = createAsyncThunk<
  void,
  { page: number; chatId: string },
  { state: RootState }
>('app/getMessagesThunk', async ({ page, chatId }, { dispatch, getState }) => {
  const state = getState();
  const user = selectUser(state);
  const isBotTyping = selectIsBotTyping(state, chatId);

  if (!user || (isBotTyping && page === 1)) {
    return;
  }

  try {
    dispatch(setIsLoading({ isLoading: true, chatId }));

    const { data } = await apiClient.getChatGetMessages(chatId, page, 20);

    dispatch(
      setMessagesByChatId({
        chatId,
        messages: data.messages.map(m => ({
          ...m,
          createdAt: m.createdAt as string,
          type: m.type as ChatMessageType,
        })),
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        shouldKeepExisting: page > 1,
      }),
    );

    eventEmitter.emit('receivedMessages');
  } catch (error) {
    console.error('getMessagesThunk error:', error);
    dispatch(setIsLoading({ isLoading: false, chatId }));
  } finally {
    dispatch(setIsLoading({ isLoading: false, chatId }));
  }
});

export const sendMessageThunk = createAsyncThunk<
  void,
  { text: string; chatId: string },
  { state: RootState }
>('app/sendMessageThunk', async ({ text, chatId }, { dispatch, getState }) => {
  const state = getState();
  const locale = selectLocale(state);
  const user = selectUser(state);

  if (!user) {
    console.error('User not found');
  }

  dispatch(
    pushMessage({
      chatId,
      message: {
        chatId,
        id: uuid(),
        createdAt: new Date().toISOString(),
        text,
        type: ChatMessageType.USER,
        userId: '',
      },
    }),
  );

  // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  await delay(200);

  dispatch(setIsBotTyping({ chatId, isTyping: true }));
  const { data } = await apiClient.getUserMe();
  dispatch(setHasFreeRequests({ hasFreeRequests: data.hasFreeRequests }));

  const isChatDisabled = selectIsChatDisabled(getState());

  if (!isChatDisabled) {
    eventEmitter.emit('newMessage');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const { data } = await apiClient.postChatSendMessage({
        chatId,
        type: 'user',
        text,
        locale: locale?.languageCode || 'en',
      });

      const { message, threadId } = data;

      dispatch(
        updateThreadId({
          chatId,
          threadId,
        }),
      );

      dispatch(
        pushMessage({
          chatId,
          message: {
            ...message,
            createdAt: message.createdAt as string,
            type: message.type as ChatMessageType,
          },
        }),
      );

      eventEmitter.emit('newMessage');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.log('sendMessageThunk', { error });
    }
  }
  dispatch(setIsBotTyping({ chatId, isTyping: false }));
  const { data: latestData } = await apiClient.getUserMe();
  dispatch(setHasFreeRequests({ hasFreeRequests: latestData.hasFreeRequests }));
});

export const getChatsThunk = createAsyncThunk<
  void,
  undefined,
  { state: RootState }
>('app/getChatsThunk', async (_, { dispatch, getState }) => {
  const state = getState();
  const user = selectUser(state);

  if (!user) {
    return;
  }

  dispatch(setGetChatsRequestState({ requestState: RequestState.waiting }));

  const { data } = await apiClient.getChatGetChats();
  dispatch(
    setChatsArrayToMap({
      chatsArray: data.map(chat => {
        return {
          ...chat,
          messages: chat.messages.map(message => {
            return {
              chatId: chat.id,
              createdAt: message.createdAt as string,
              id: message.id,
              text: message.text,
              type: message.type as ChatMessageType,
              userId: message.userId,
            };
          }),
          threadId: chat.threadId || undefined,
          updatedAt: chat.updatedAt as string,
        };
      }),
    }),
  );

  dispatch(setGetChatsRequestState({ requestState: RequestState.success }));
});

export const renameChatThunk = createAsyncThunk<
  void,
  {
    chatId: string;
    title: string;
  },
  { state: RootState }
>('app/renameChatThunk', async ({ chatId, title }, { dispatch, getState }) => {
  const state = getState();
  const user = selectUser(state);

  if (!user) {
    return;
  }

  try {
    await apiClient.putChatRenameChat({
      chatId,
      newTitle: title,
    });
  } catch (error) {
    console.error('renameChatThunk error:', error);
  }

  dispatch(getChatsThunk());
});

export const deleteChatThunk = createAsyncThunk<
  void,
  {
    chatId: string;
  },
  { state: RootState }
>('app/deleteChatThunk', async ({ chatId }, { dispatch, getState }) => {
  const state = getState();
  const user = selectUser(state);

  if (!user) {
    return;
  }

  await apiClient.deleteChatDeleteChat(chatId);

  dispatch(getChatsThunk());
});
