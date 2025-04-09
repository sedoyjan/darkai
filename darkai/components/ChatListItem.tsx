import { useRouter } from 'expo-router';
import { memo, useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { getMessagesThunk } from '@/rdx/chat/thunks';
import { useAppDispatch } from '@/rdx/store';
import { Chat } from '@/types';
import { formatDistance } from '@/utils/dates';

import { Avatar } from './Chat/Avatar';

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    backgroundColor: Colors.semiTransparentBg,
    marginBottom: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    gap: 12,
  },
  title: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  },
  message: {
    color: Colors.white,
    fontSize: 13,
    opacity: 0.8,
  },
  texts: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14,
  },
  timestamp: {
    color: Colors.white,
    fontSize: 12,
  },
});

interface ChatListItemProps {
  chat: Chat;
}

export const ChatListItem = memo(({ chat }: ChatListItemProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onEdit = useCallback(() => {
    router.push(`/editChatModal?chatId=${chat.id}`);
  }, [chat.id, router]);

  const onPress = useCallback(() => {
    dispatch(
      getMessagesThunk({
        chatId: chat.id,
        page: 1,
      }),
    );
    router.push(`/(tabs)/(chats)/${chat.id}?title=${chat.title}`);
  }, [chat.id, chat.title, dispatch, router]);

  const cleanedTitle = useMemo(() => {
    return chat.title.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  }, [chat.title]);

  const latestMessageTest = useMemo(() => {
    return chat.messages[0]?.text
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }, [chat.messages]);

  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={onPress}
      onLongPress={onEdit}
    >
      <View style={styles.content}>
        <Avatar />
        <View style={styles.texts}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {cleanedTitle}
          </Text>
          <Text style={styles.message} numberOfLines={2} ellipsizeMode="tail">
            {latestMessageTest}
          </Text>
        </View>
      </View>
      <View style={styles.meta}>
        <Text style={styles.timestamp}>{formatDistance(chat.updatedAt)}</Text>
      </View>
    </TouchableOpacity>
  );
});
