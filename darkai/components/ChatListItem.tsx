import { useRouter } from 'expo-router';
import { memo, useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { getMessagesThunk } from '@/rdx/chat/thunks';
import { useAppDispatch } from '@/rdx/store';
import { Chat } from '@/types';
import { formatDistance } from '@/utils/dates';

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
    fontSize: 16,
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
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

  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={onPress}
      onLongPress={onEdit}
    >
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {cleanedTitle}
      </Text>
      <View style={styles.meta}>
        <Text style={styles.timestamp}>{formatDistance(chat.updatedAt)}</Text>
      </View>
    </TouchableOpacity>
  );
});
