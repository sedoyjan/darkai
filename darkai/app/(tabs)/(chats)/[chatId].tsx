import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/blocks/Button';
import { Background } from '@/components/Background';
import { ChatInput } from '@/components/Chat/ChatInput';
import { Message } from '@/components/Chat/Message';
import { Header } from '@/components/Header';
import { SafeAreaKeyboardAvoidingView } from '@/components/SafeAreaKeyboardAvoidingView';
import { eventEmitter } from '@/EventEmitter';
import { useKeyboardListener } from '@/hooks/useKeyboardListener';
import { usePreviousWithInitialValue } from '@/hooks/usePrevious';
import { setupMessagingThunk } from '@/rdx/app/thunks';
import { useChat } from '@/rdx/chat/hooks/useChat';
import { selectCurrentPage, selectIsChatDisabled } from '@/rdx/chat/selectors';
import { getMessagesThunk } from '@/rdx/chat/thunks';
import { useAppDispatch, useAppSelector } from '@/rdx/store';
import { ChatMessage, ChatMessageType } from '@/types';

import { ChatsParamList } from './_layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  systemMessageWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
  },
  systemMessageText: {
    fontSize: 14,
    color: 'gray',
  },
});

export default function ChatScreen() {
  const route = useRoute<RouteProp<ChatsParamList, 'Chat'>>();
  const { chatId, title } = route.params;
  const { t } = useTranslation();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const { messages, sendMessage } = useChat(chatId);
  const dispatch = useAppDispatch();
  const listRef = useRef<FlashList<ChatMessage>>(null);
  const isFocused = useIsFocused();
  const isFocusedPrev = usePreviousWithInitialValue(isFocused);
  const router = useRouter();
  const currentPage = useAppSelector(selectCurrentPage);
  const isLoadingPrevMessagesRef = useRef(false);
  const isChatDisabled = useAppSelector(selectIsChatDisabled);

  const [pageTitle, setPageTitle] = useState(title);

  const scrollToEnd = useCallback(() => {
    if (messages.length > 0) {
      listRef.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  }, [messages.length]);

  const onSubscribePress = useCallback(() => {
    router.push('/subscriptionModal');
  }, [router]);

  const onNewMessage = useCallback(() => {
    setTimeout(() => {
      scrollToEnd();
    }, 300);
  }, [scrollToEnd]);

  const onReceivedMessages = useCallback(() => {
    isLoadingPrevMessagesRef.current = false;
  }, []);

  useEffect(() => {
    eventEmitter.on('newMessage', onNewMessage);
    eventEmitter.on('receivedMessages', onReceivedMessages);
    return () => {
      eventEmitter.off('newMessage', onNewMessage);
      eventEmitter.off('receivedMessages', onReceivedMessages);
    };
  }, [onNewMessage, onReceivedMessages]);

  useEffect(() => {
    if (isFocused && !isFocusedPrev) {
      isLoadingPrevMessagesRef.current = false;
      // requestAnimationFrame(() => {
      //   dispatch(getMessagesThunk({ page: 1 }));
      // });
    }
  }, [dispatch, isFocused, isFocusedPrev, scrollToEnd]);

  useKeyboardListener({
    onKeyboardDidShow: scrollToEnd,
    onKeyboardDidHide: scrollToEnd,
  });

  const renderMessage = useCallback<ListRenderItem<ChatMessage>>(
    ({ item }) => {
      if (item.type === ChatMessageType.SYSTEM) {
        return (
          <View style={styles.systemMessageWrapper} key={item.text}>
            <Text style={styles.systemMessageText}>
              {format(item.text, 'dd.MM.yyyy')}
            </Text>
          </View>
        );
      }
      if (item.text === 'out-of-free-messages') {
        return (
          <Message
            createdAt={item.createdAt}
            id={item.id}
            imageHash={item.imageHash}
            imageUrl={item.imageUrl}
            key={item.id}
            text={t('screens.chat.botMessages.outOfMessages')}
            type={item.type}
            userId={item.userId}
          >
            <Button
              title={t('common.upgradeToPlus')}
              isSmall
              isCTA
              onPress={onSubscribePress}
            />
          </Message>
        );
      }
      if (item.text === 'no-messages') {
        return (
          <Message
            createdAt={item.createdAt}
            id={item.id}
            imageHash={item.imageHash}
            imageUrl={item.imageUrl}
            key={item.id}
            text={t('screens.chat.botMessages.no-messages')}
            type={item.type}
            userId={item.userId}
          />
        );
      }
      if (item.text === 'bot-typing') {
        return (
          <Message
            createdAt={item.createdAt}
            id={item.id}
            imageHash={item.imageHash}
            imageUrl={item.imageUrl}
            isTyping
            key={item.id}
            text={undefined}
            type={item.type}
            userId={item.userId}
          />
        );
      }
      return (
        <Message
          createdAt={item.createdAt}
          id={item.id}
          imageHash={item.imageHash}
          imageUrl={item.imageUrl}
          key={item.id}
          text={item.text}
          type={item.type}
          userId={item.userId}
        />
      );
    },
    [onSubscribePress, t],
  );

  const onSendTextMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      setPageTitle(title);
      await dispatch(setupMessagingThunk());
      sendMessage({ text });
      requestAnimationFrame(() => {
        scrollToEnd();
      });
    },
    [dispatch, scrollToEnd, sendMessage, title],
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scroll = Math.round(
        e.nativeEvent.layoutMeasurement.height + e.nativeEvent.contentOffset.y,
      );
      const height = Math.round(e.nativeEvent.contentSize.height);
      const isEnd = scroll >= height;

      if (isEnd && !isLoadingPrevMessagesRef.current && messages.length > 10) {
        isLoadingPrevMessagesRef.current = true;
        dispatch(getMessagesThunk({ page: currentPage + 1 }));
      }
    },
    [currentPage, dispatch, messages.length],
  );

  return (
    <Background>
      <SafeAreaKeyboardAvoidingView
        edges={['top']}
        tabBarHeight={bottomTabBarHeight}
      >
        <Header title={pageTitle} withBackButton />
        <View style={styles.container}>
          <FlashList
            onScroll={onScroll}
            ref={listRef}
            data={messages}
            renderItem={renderMessage}
            estimatedItemSize={200}
            inverted
            showsVerticalScrollIndicator={false}
          />
          <ChatInput
            isDisabled={isChatDisabled}
            onSendTextMessage={onSendTextMessage}
          />
        </View>
      </SafeAreaKeyboardAvoidingView>
    </Background>
  );
}
