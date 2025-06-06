import '@/services/sounds';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useReactNavigationDevTools } from '@bam.tech/react-navigation-visualizer-dev-plugin';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import {
  Stack,
  useGlobalSearchParams,
  useNavigationContainerRef,
  usePathname,
  useRouter,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { get } from 'lodash';
import { useCallback, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { apiClient } from '@/api';
import { KeyboardHeightContextProvider } from '@/components/KeyboardHeightContextProvider';
import { RecordModeStatusBar } from '@/components/RecordModeStatusBar';
import { IS_DEV } from '@/const';
import { useColorScheme } from '@/hooks/useColorScheme';
import i18n from '@/i18n';
import { initThunk } from '@/rdx/app/thunks';
import { persistor, store } from '@/rdx/store';
import { analytics } from '@/services/firebase';
import {
  isNotificationHandled,
  markNotificationAsHandled,
  navigateToChat,
} from '@/services/notifications';
import { sharedRouter } from '@/services/sharedRouter';
import { sharedStyles } from '@/sharedStyles';

LogBox.ignoreLogs(['ExpandableCalendar']);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

export type RootParamList = {
  SubscriptionModal: {};
  SignIn: {
    text?: string;
    chatId?: string;
    redirectScreen?: string;
  };
};

export const formSheetOptions = {
  presentation: 'formSheet',
  sheetAllowedDetents: 'fitToContents',
  sheetCornerRadius: 24,
  // sheetGrabberVisible: true,
} as const;

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);

  useEffect(() => {
    if (!IS_DEV) {
      apiClient.postAnalyticsLaunch({});
    } else {
      console.log('Analytics launch event skipped in dev mode');
    }
  }, []);

  useEffect(() => {
    analytics.logScreenView({
      screen_name: pathname,
      screen_class: pathname,
    });
  }, [pathname, params]);

  const init = useCallback(async () => {
    try {
      sharedRouter.setRouter(router);
      store.dispatch(initThunk());

      const initialNotification =
        await Notifications.getLastNotificationResponseAsync();

      if (initialNotification) {
        const chatId = get(
          initialNotification,
          'notification.request.trigger.payload.chatId',
          null,
        );
        const notificationId =
          initialNotification.notification.request.identifier;
        const hasBeenHandled = await isNotificationHandled(notificationId);

        if (!hasBeenHandled && chatId) {
          await markNotificationAsHandled(notificationId);
          router.replace('/(tabs)/(chats)');
          await navigateToChat(chatId as string);
        } else {
          router.replace('/(tabs)/(chats)');
        }
      } else {
        router.replace('/(tabs)/(chats)');
      }
    } catch (error) {
      console.error('Initialization error:', error);
      router.replace('/(tabs)/(chats)'); // Fallback navigation
    } finally {
      await SplashScreen.hideAsync(); // Always hide splash screen
    }
  }, [router]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <StatusBar style="light" hidden={false} />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <>
            <RecordModeStatusBar />
            <I18nextProvider i18n={i18n}>
              <RootSiblingParent>
                <KeyboardHeightContextProvider>
                  <GestureHandlerRootView style={sharedStyles.wrapper}>
                    <SafeAreaProvider>
                      <ThemeProvider
                        value={
                          colorScheme === 'dark' ? DarkTheme : DefaultTheme
                        }
                      >
                        <Stack
                          screenOptions={{
                            headerShown: false,
                          }}
                        >
                          <Stack.Screen
                            name="(tabs)"
                            options={{
                              animation: 'fade',
                            }}
                          />
                          <Stack.Screen name="index" />
                          <Stack.Screen
                            name="signin"
                            options={{
                              presentation: 'modal',
                            }}
                          />
                          <Stack.Screen
                            name="subscriptionModal"
                            options={{
                              presentation: 'modal',
                            }}
                          />
                          <Stack.Screen
                            name="onboardingModal"
                            options={{
                              presentation: 'modal',
                              gestureEnabled: false,
                            }}
                          />

                          <Stack.Screen
                            name="termsModal"
                            options={{
                              presentation: 'modal',
                            }}
                          />
                          <Stack.Screen
                            name="privacyModal"
                            options={{
                              presentation: 'modal',
                            }}
                          />
                          <Stack.Screen
                            name="editChatModal"
                            options={{
                              presentation: 'modal',
                            }}
                          />
                        </Stack>
                      </ThemeProvider>
                    </SafeAreaProvider>
                  </GestureHandlerRootView>
                </KeyboardHeightContextProvider>
              </RootSiblingParent>
            </I18nextProvider>
          </>
        </PersistGate>
      </Provider>
    </>
  );
}
