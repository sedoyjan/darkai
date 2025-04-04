import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export type TasksStackParamList = {
  Task: {
    task: string;
  };
  EditTask: {
    taskId: string;
  };
  CreateTask: {
    parentTaskId?: string;
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
        <Stack.Screen name="[task]" />
      </Stack>
    </>
  );
}
