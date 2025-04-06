import { createAsyncThunk } from '@reduxjs/toolkit';
import * as Haptics from 'expo-haptics';
import { Href } from 'expo-router';

import { apiClient } from '@/api';
import { eventEmitter } from '@/EventEmitter';
import { sharedRouter } from '@/services/sharedRouter';
import { ChatMessageType } from '@/types';
import { delay } from '@/utils/utils';

import { RootState } from '..';
import { selectLocale, selectUser } from '../app/selectors';
import { setHasFreeRequests } from '../app/slice';
import { selectIsBotTyping } from './selectors';
import {
  pushMessage,
  setIsBotTyping,
  setIsLoading,
  setMessages,
} from './slice';

export const getMessagesThunk = createAsyncThunk<
  void,
  { page: number },
  { state: RootState }
>('app/getMessagesThunk', async ({ page }, { dispatch, getState }) => {
  const state = getState();
  const user = selectUser(state);
  const isBotTyping = selectIsBotTyping(state);

  if (!user || (isBotTyping && page === 1)) {
    return;
  }

  try {
    dispatch(setIsLoading({ isLoading: true }));

    const { data } = await apiClient.getChatGetMessages(page, 20);

    dispatch(
      setMessages({
        page: data.pagination.page,
        shouldKeepExisting: page > 1,
        hasMoreMessages: !!data.messages.length,
        messages: data.messages.map(m => {
          return {
            ...m,
            imageUrl: m.imageUrl || undefined,
            imageHash: m.imageHash || undefined,
            createdAt: m.createdAt as string,
            type: m.type as ChatMessageType,
          };
        }),
      }),
    );
    eventEmitter.emit('receivedMessages');
  } catch (error) {
    console.log('getMessagesThunk', { error });
    dispatch(setIsLoading({ isLoading: false }));
  }
});

export const sendMessageThunk = createAsyncThunk<
  void,
  { text: string },
  { state: RootState }
>('app/sendMessageThunk', async ({ text }, { dispatch, getState }) => {
  const state = getState();
  const locale = selectLocale(state);
  const user = selectUser(state);

  if (!user) {
    let url = '/signin';
    if (text) {
      url += `?text=${text}`;
    }

    sharedRouter.getRouter().push(url as Href);

    return;
  }

  dispatch(
    pushMessage({
      message: {
        createdAt: new Date().toISOString(),
        id: Math.random().toString(),
        text,
        type: ChatMessageType.USER,
        userId: '1',
      },
    }),
  );
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  await delay(200);

  dispatch(setIsBotTyping({ isTyping: true }));
  // const { data } = await apiClient.getUserMe();
  // dispatch(setHasFreeRequests({ hasFreeRequests: data.hasFreeRequests }));

  // if (data.hasFreeRequests) {
  if (true) {
    eventEmitter.emit('newMessage');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const { data } = await apiClient.postChatSendMessage({
        type: 'user',
        text,
        locale: locale?.languageCode || 'en',
      });

      dispatch(
        pushMessage({
          message: {
            ...data.message,
            createdAt: data.message.createdAt as string,
            type: data.message.type as ChatMessageType,
          },
        }),
      );

      eventEmitter.emit('newMessage');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.log('sendMessageThunk', { error });
    }
  }
  dispatch(setIsBotTyping({ isTyping: false }));
  const { data: latestData } = await apiClient.getUserMe();
  dispatch(setHasFreeRequests({ hasFreeRequests: latestData.hasFreeRequests }));
});
