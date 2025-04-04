import { RouteProp, useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import RevenueCatUI from 'react-native-purchases-ui';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Background } from '@/components/Background';
import { setHasActiveSubscription } from '@/rdx/app/slice';
import { useAppDispatch } from '@/rdx/store';
import { decomposeTaskThunk } from '@/rdx/tasks/thunks';
import { sharedStyles } from '@/sharedStyles';

import { RootParamList } from './_layout';

export default function SubscriptionModalScreen() {
  const dispatch = useAppDispatch();

  const route = useRoute<RouteProp<RootParamList, 'SubscriptionModal'>>();

  const router = useRouter();

  const onClose = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const onSuccess = useCallback(async () => {
    dispatch(setHasActiveSubscription({ hasActiveSubscription: true }));
    if (route.params.taskId) {
      dispatch(decomposeTaskThunk({ id: route.params.taskId }));
    }
    if (router.canGoBack()) {
      router.back();
    }
  }, [dispatch, route.params.taskId, router]);

  const onFail = useCallback(async () => {
    dispatch(setHasActiveSubscription({ hasActiveSubscription: false }));
  }, [dispatch]);

  return (
    <Background solid>
      <SafeAreaView style={sharedStyles.wrapper} edges={['bottom']}>
        <RevenueCatUI.Paywall
          options={{
            displayCloseButton: true,
          }}
          onDismiss={onClose}
          onPurchaseError={() => {
            onFail();
          }}
          onPurchaseCancelled={() => {
            onFail();
          }}
          onPurchaseStarted={() => {
            console.log('🚀 ~ onPurchaseStarted');
          }}
          onRestoreStarted={() => {
            console.log('🚀 ~ onRestoreStarted');
          }}
          onRestoreError={() => {
            onFail();
          }}
          onRestoreCompleted={({ customerInfo }) => {
            if (customerInfo.activeSubscriptions) {
              onSuccess();
            }
          }}
          onPurchaseCompleted={({ customerInfo }) => {
            if (customerInfo.activeSubscriptions) {
              onSuccess();
            }
          }}
        />
      </SafeAreaView>
    </Background>
  );
}
