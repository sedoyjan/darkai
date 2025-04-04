import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Background } from '@/components/Background';
import { Header } from '@/components/Header';
import { WebViewAccept } from '@/components/WebViewAccept';
import { PRIVACY_POLICY_URL } from '@/const';
import { sharedStyles } from '@/sharedStyles';

export default function PrivacyPolicyScreen() {
  const { t } = useTranslation();
  return (
    <Background>
      <SafeAreaView style={sharedStyles.wrapper}>
        <Header title={t('screens.privacyPolicy.title')} />
        <WebViewAccept url={PRIVACY_POLICY_URL} />
      </SafeAreaView>
    </Background>
  );
}
