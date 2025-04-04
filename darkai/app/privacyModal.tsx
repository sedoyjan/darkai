import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Background } from '@/components/Background';
import { Header } from '@/components/Header';
import { WebViewAccept } from '@/components/WebViewAccept';
import { PRIVACY_POLICY_URL } from '@/const';
import { setIsPrivacyAccepted } from '@/rdx/settings/slice';
import { useAppDispatch } from '@/rdx/store';
import { sharedStyles } from '@/sharedStyles';

export default function PrivacyModalScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onClose = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const onAccept = useCallback(() => {
    dispatch(setIsPrivacyAccepted(true));
    if (router.canGoBack()) {
      router.back();
    }
  }, [dispatch, router]);

  return (
    <Background>
      <Header
        title={t('screens.privacyPolicy.title')}
        withBackButton={false}
        rightButtonIcon="close"
        onRightButtonPress={onClose}
      />
      <SafeAreaView style={sharedStyles.wrapper} edges={['bottom']}>
        <WebViewAccept url={PRIVACY_POLICY_URL} onAccept={onAccept} />
      </SafeAreaView>
    </Background>
  );
}
