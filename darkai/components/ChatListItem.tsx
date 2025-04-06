import { useRouter } from 'expo-router';
import { memo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Colors } from '@/constants/Colors';
import { getMessagesByChatIdThunk } from '@/rdx/chat/thunks';
import { useAppDispatch } from '@/rdx/store';
import { Chat } from '@/types';

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    backgroundColor: Colors.semiTransparentBg,
    marginBottom: 8,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  title: {
    color: Colors.white,
  },
});

interface ChatListItemProps {
  chat: Chat;
}

export const ChatListItem = memo(({ chat }: ChatListItemProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onPress = useCallback(() => {
    dispatch(
      getMessagesByChatIdThunk({
        chatId: chat.id,
      }),
    );
    router.push(`/(tabs)/(chats)/${chat.id}?title=${chat.title}`);
  }, [chat.id, chat.title, dispatch, router]);

  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress}>
      <Text style={styles.title}>{chat.title}</Text>
    </TouchableOpacity>
  );
});
