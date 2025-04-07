import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Background } from '@/components/Background';
import { Header } from '@/components/Header';
import { sharedStyles } from '@/sharedStyles';

export default function EditChatModalScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const onClose = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  return (
    <Background>
      <Header
        title={t('screens.editChatModal.title')}
        withBackButton={false}
        rightButtonIcon="close"
        onRightButtonPress={onClose}
      />
      <SafeAreaView
        style={sharedStyles.wrapper}
        edges={['bottom']}
      ></SafeAreaView>
    </Background>
  );
}
