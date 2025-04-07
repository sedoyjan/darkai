import { useCallback } from 'react';

import { RootState } from '../..';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  makeSelectChatMessages,
  selectIsBotTyping,
  selectIsChatDisabled,
  selectIsLoading,
} from '../selectors';
import { sendMessageThunk } from '../thunks';

export const useChat = (chatId: string) => {
  const dispatch = useAppDispatch();

  const isDisabled = useAppSelector(selectIsChatDisabled);

  // Selectors moved and adapted for chatId-specific data
  const selectChatMessages = makeSelectChatMessages();
  const messages = useAppSelector((state: RootState) =>
    selectChatMessages(state, chatId),
  );

  const isLoading = useAppSelector((state: RootState) =>
    selectIsLoading(state, chatId),
  );

  const isBotTyping = useAppSelector((state: RootState) =>
    selectIsBotTyping(state, chatId),
  );

  const currentPage = useAppSelector(
    (state: RootState) => state.chat.chatsParamsMap[chatId]?.currentPage ?? 0,
  );

  const totalPages = useAppSelector(
    (state: RootState) => state.chat.chatsParamsMap[chatId]?.totalPages ?? 0,
  );

  const hasMoreMessages = useAppSelector(
    (state: RootState) =>
      state.chat.chatsParamsMap[chatId]?.hasMoreMessages ?? false,
  );

  // Assuming totalMessages might be derived from messages length if not stored in state
  const totalMessages = useAppSelector(
    (state: RootState) => state.chat.chatsMap[chatId]?.messages.length ?? 0,
  );

  const sendMessage = useCallback(
    ({ text }: { text: string }) => {
      dispatch(
        sendMessageThunk({
          chatId,
          text,
        }),
      );
    },
    [chatId, dispatch],
  );

  return {
    messages,
    sendMessage,
    isLoading,
    isBotTyping,
    currentPage,
    totalPages,
    totalMessages,
    hasMoreMessages,
    isDisabled,
  };
};
