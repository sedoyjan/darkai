import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { get } from 'lodash';
import { useEffect } from 'react';

import { getChatsThunk, getMessagesThunk } from '@/rdx/chat/thunks';
import { store } from '@/rdx/store';

import { sharedRouter } from './sharedRouter';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    return false;
  }
  return true;
}

export const navigateToChat = async (chatId: string) => {
  await store.dispatch(getChatsThunk());
  const state = store.getState();
  const chat = state.chat.chatsMap[chatId];
  const title = chat?.title || '';
  await store.dispatch(
    getMessagesThunk({
      chatId: chatId as string,
      page: 1,
    }),
  );

  sharedRouter.getRouter().replace(`/(tabs)/(chats)/${chatId}?title=${title}`);
};

export const markNotificationAsHandled = async (notificationId: string) => {
  try {
    await AsyncStorage.setItem(`handledNotification:${notificationId}`, 'true');
  } catch (error) {}
};

export const isNotificationHandled = async (
  notificationId: string,
): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(
      `handledNotification:${notificationId}`,
    );
    return value === 'true';
  } catch (error) {
    return false;
  }
};

export const useNotifications = () => {
  useEffect(() => {
    const notificationResponseReceivedSubscription =
      Notifications.addNotificationResponseReceivedListener(async response => {
        const notificationId = response.notification.request.identifier;
        const chatId = get(
          response,
          'notification.request.content.data.chatId',
          null,
        );

        const hasBeenHandled = await isNotificationHandled(notificationId);
        if (hasBeenHandled) {
          return;
        }

        await markNotificationAsHandled(notificationId);

        if (chatId) {
          await navigateToChat(chatId as string);
        }

        await Notifications.dismissNotificationAsync(notificationId);
      });

    const checkInitialNotification = async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (response) {
        const notificationId = response.notification.request.identifier;
        const chatId = get(
          response,
          'notification.request.content.data.chatId',
          null,
        );

        const hasBeenHandled = await isNotificationHandled(notificationId);
        if (hasBeenHandled) {
          return;
        }

        await markNotificationAsHandled(notificationId);

        if (chatId) {
          await navigateToChat(chatId as string);
        }

        await Notifications.dismissNotificationAsync(notificationId);
      }
    };

    checkInitialNotification();

    return () => {
      notificationResponseReceivedSubscription.remove();
    };
  }, []);
};
