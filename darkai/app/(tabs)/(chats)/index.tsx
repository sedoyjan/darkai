import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { RefreshControl, View } from 'react-native';

import { Button } from '@/blocks/Button';
import { Spacer } from '@/blocks/Spacer';
import { Background } from '@/components/Background';
import { ChatListItem } from '@/components/ChatListItem';
import { Header } from '@/components/Header';
import { SafeAreaKeyboardAvoidingView } from '@/components/SafeAreaKeyboardAvoidingView';
import { useOnboardingRedirect } from '@/rdx/app/hooks/useOnboardingRedirect';
import { useChats } from '@/rdx/chat/hooks/useChats';
import {
  selectAreChatsLoading,
  selectChatListHash,
} from '@/rdx/chat/selectors';
import { getChatsThunk } from '@/rdx/chat/thunks';
import { useAppDispatch, useAppSelector } from '@/rdx/store';
import { sharedStyles } from '@/sharedStyles';
import { Chat } from '@/types';
import { uuid } from '@/utils';

export default function ChatsScreen() {
  const listHash = useAppSelector(selectChatListHash);
  const dispatch = useAppDispatch();
  const areChatsLoading = useAppSelector(selectAreChatsLoading);
  const chats = useChats();
  const bottomTabBarHeight = useBottomTabBarHeight();
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
        refreshing={areChatsLoading}
        onRefresh={onRefresh}
        tintColor="#ffffff"
        colors={['#ffffff']}
      />
    );
  }, [areChatsLoading, onRefresh]);

  return (
    <Background>
      <SafeAreaKeyboardAvoidingView
        edges={['top']}
        tabBarHeight={bottomTabBarHeight}
      >
        <Header title="Chat List" withBackButton={false} />

        {chats.length > 0 ? (
          <FlashList
            key={listHash}
            data={chats}
            renderItem={renderItem}
            estimatedItemSize={200}
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}
          />
        ) : (
          <Spacer />
        )}

        <View style={sharedStyles.bottomButton}>
          <Button
            title="Start a new chat"
            isCTA
            onPress={() => {
              router.push(`/(tabs)/(chats)/${uuid()}?title=New Chat`);
            }}
          />
        </View>
      </SafeAreaKeyboardAvoidingView>
    </Background>
  );
}
