import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, View } from 'react-native';

import { Button } from '@/blocks/Button';
import { Background } from '@/components/Background';
import { ChatListItem } from '@/components/ChatListItem';
import { Header } from '@/components/Header';
import { Helper } from '@/components/Helper';
import { SafeAreaKeyboardAvoidingView } from '@/components/SafeAreaKeyboardAvoidingView';
import { usePreviousWithInitialValue } from '@/hooks/usePrevious';
import { useOnboardingRedirect } from '@/rdx/app/hooks/useOnboardingRedirect';
import { useChats } from '@/rdx/chat/hooks/useChats';
import {
  selectAreChatsLoading,
  selectChatListHash,
  selectIsQuiteLoading,
} from '@/rdx/chat/selectors';
import { setIsQuiteLoading } from '@/rdx/chat/slice';
import { getChatsThunk } from '@/rdx/chat/thunks';
import { useAppDispatch, useAppSelector } from '@/rdx/store';
import { sharedStyles } from '@/sharedStyles';
import { Chat } from '@/types';
import { uuid } from '@/utils';

export default function ChatsScreen() {
  const { t } = useTranslation();
  const listHash = useAppSelector(selectChatListHash);
  const dispatch = useAppDispatch();
  const areChatsLoading = useAppSelector(selectAreChatsLoading);
  const isQuiteLoading = useAppSelector(selectIsQuiteLoading);
  const chats = useChats();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();
  const isFocusedPrev = usePreviousWithInitialValue(isFocused);

  const isSpinnerVisible = areChatsLoading && !isQuiteLoading;

  useEffect(() => {
    if (isFocused && !isFocusedPrev) {
      dispatch(
        setIsQuiteLoading({
          isQuiteLoading: true,
        }),
      );
      requestAnimationFrame(() => {
        dispatch(getChatsThunk());
      });
    }
  }, [isFocused, isFocusedPrev, dispatch]);

  useOnboardingRedirect();

  const renderItem = useCallback<ListRenderItem<Chat>>(({ item }) => {
    return <ChatListItem key={item.id} chat={item} />;
  }, []);

  const onRefresh = useCallback(() => {
    dispatch(getChatsThunk());
  }, [dispatch]);

  const refreshControl = useMemo(() => {
    return (
      <RefreshControl
        refreshing={isSpinnerVisible}
        onRefresh={onRefresh}
        tintColor="#ffffff"
        colors={['#ffffff']}
      />
    );
  }, [isSpinnerVisible, onRefresh]);

  return (
    <Background>
      <SafeAreaKeyboardAvoidingView
        edges={['top']}
        tabBarHeight={bottomTabBarHeight}
      >
        <Header title="Chat List" withBackButton={false} />

        <FlashList
          key={listHash}
          data={chats}
          renderItem={renderItem}
          estimatedItemSize={200}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        />

        <View style={sharedStyles.bottomButton}>
          {chats.length > 0 ? (
            <Button
              title="Start a new chat"
              isSuccess
              onPress={() => {
                router.push(`/(tabs)/(chats)/${uuid()}?title=New Chat`);
              }}
            />
          ) : (
            <Helper
              isVisible
              title={t('screens.chats.robot.title')}
              text={t('screens.chats.robot.text')}
              withCloseButton={false}
            >
              <Button
                title="Start a new chat"
                isSuccess
                onPress={() => {
                  router.push(`/(tabs)/(chats)/${uuid()}?title=New Chat`);
                }}
              />
            </Helper>
          )}
        </View>
      </SafeAreaKeyboardAvoidingView>
    </Background>
  );
}
