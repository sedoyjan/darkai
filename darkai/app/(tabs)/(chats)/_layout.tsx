import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export type ChatsParamList = {
  Chat: {
    chatId: string;
    title: string;
  };
};

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="[chatId]" />
      </Stack>
    </>
  );
}
