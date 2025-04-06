import '@/services/sounds';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useReactNavigationDevTools } from '@bam.tech/react-navigation-visualizer-dev-plugin';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import {
  Stack,
  useGlobalSearchParams,
  useNavigationContainerRef,
  usePathname,
  useRouter,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
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
import { useColorScheme } from '@/hooks/useColorScheme';
import i18n from '@/i18n';
import { initThunk } from '@/rdx/app/thunks';
import { persistor, store } from '@/rdx/store';
import { analytics } from '@/services/firebase';
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
    imageUri?: string;
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
    analytics.logScreenView({
      screen_name: pathname,
      screen_class: pathname,
    });
  }, [pathname, params]);

  const init = useCallback(async () => {
    sharedRouter.setRouter(router);
    await store.dispatch(initThunk());
    router.replace('/(tabs)/(chats)');
    SplashScreen.hideAsync();
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
