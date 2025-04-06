import { useCallback } from 'react';

import { ChatMessageType } from '@/types';
import { uuid } from '@/utils';

import { RootState } from '../..';
import { useAppDispatch, useAppSelector } from '../../store';
import { makeSelectChatMessages } from '../selectors';
import { pushMessage } from '../slice';
import { sendMessageThunk } from '../thunks';

export const useChat = (chatId: string) => {
  const selectChatMessages = makeSelectChatMessages();
  const dispatch = useAppDispatch();

  const messages = useAppSelector((state: RootState) =>
    selectChatMessages(state, chatId),
  );

  const sendMessage = useCallback(
    ({ text }: { text: string }) => {
      console.log('sendMessage', { text, chatId });
      dispatch(
        sendMessageThunk({
          chatId,
          text,
        }),
      );
    },
    [chatId, dispatch],
  );

  return { messages, sendMessage };
};
