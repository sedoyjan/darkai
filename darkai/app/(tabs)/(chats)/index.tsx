import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';

import { Button } from '@/blocks/Button';
import { Background } from '@/components/Background';
import { ChatListItem } from '@/components/ChatListItem';
import { Header } from '@/components/Header';
import { SafeAreaKeyboardAvoidingView } from '@/components/SafeAreaKeyboardAvoidingView';
import { Spacer } from '@/components/Spacer';
import { useChats } from '@/rdx/chat/hooks/useChats';
import { sharedStyles } from '@/sharedStyles';
import { Chat } from '@/types';
import { uuid } from '@/utils';

export default function ChatsScreen() {
  const chats = useChats();
  const bottomTabBarHeight = useBottomTabBarHeight();

  const renderItem = useCallback<ListRenderItem<Chat>>(({ item }) => {
    return <ChatListItem key={item.id} chat={item} />;
  }, []);

  return (
    <Background>
      <SafeAreaKeyboardAvoidingView
        edges={['top']}
        tabBarHeight={bottomTabBarHeight}
      >
        <Header title="Chat List" withBackButton={false} />
        <View style={sharedStyles.wrapper}>
          {chats.length > 0 ? (
            <FlashList
              data={chats}
              renderItem={renderItem}
              estimatedItemSize={200}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Spacer />
          )}
          <Button
            title="Start a new chat"
            onPress={() => {
              router.push(`/(tabs)/(chats)/${uuid()}?title=New Chat`);
            }}
          />
        </View>
      </SafeAreaKeyboardAvoidingView>
    </Background>
  );
}
