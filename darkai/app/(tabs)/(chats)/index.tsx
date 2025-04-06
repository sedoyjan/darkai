import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Button } from '@/blocks/Button';
import { Background } from '@/components/Background';
import { Header } from '@/components/Header';
import { SafeAreaKeyboardAvoidingView } from '@/components/SafeAreaKeyboardAvoidingView';
import { Spacer } from '@/components/Spacer';
import { Colors } from '@/constants/Colors';
import { useChats } from '@/rdx/chat/hooks/useChats';
import { sharedStyles } from '@/sharedStyles';
import { Chat } from '@/types';
import { uuid } from '@/utils';

export default function ChatsScreen() {
  const chats = useChats();
  const bottomTabBarHeight = useBottomTabBarHeight();

  const renderItem = useCallback<ListRenderItem<Chat>>(({ item }) => {
    return (
      <TouchableOpacity
        style={{
          padding: 16,
          backgroundColor: Colors.semiTransparentBg,
          marginBottom: 8,
          borderRadius: 8,
          marginHorizontal: 16,
        }}
        onPress={() => {
          router.push(`/(tabs)/(chats)/${item.id}`);
        }}
      >
        <Text style={{ color: 'white' }}>{item.id}</Text>
      </TouchableOpacity>
    );
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
