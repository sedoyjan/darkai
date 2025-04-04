import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Background } from '@/components/Background';
import { Header } from '@/components/Header';
import { WebViewAccept } from '@/components/WebViewAccept';
import { TERMS_AND_CONDITIONS_URL } from '@/const';
import { setIsTermsAccepted } from '@/rdx/settings/slice';
import { useAppDispatch } from '@/rdx/store';
import { sharedStyles } from '@/sharedStyles';

export default function TermsModalScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onClose = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const onAccept = useCallback(() => {
    dispatch(setIsTermsAccepted(true));
    if (router.canGoBack()) {
      router.back();
    }
  }, [dispatch, router]);

  return (
    <Background>
      <Header
        title={t('screens.termsAndConditions.title')}
        withBackButton={false}
        rightButtonIcon="close"
        onRightButtonPress={onClose}
      />
      <SafeAreaView style={sharedStyles.wrapper} edges={['bottom']}>
        <WebViewAccept url={TERMS_AND_CONDITIONS_URL} onAccept={onAccept} />
      </SafeAreaView>
    </Background>
  );
}
