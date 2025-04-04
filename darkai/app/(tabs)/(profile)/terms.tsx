import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Background } from '@/components/Background';
import { Header } from '@/components/Header';
import { WebViewAccept } from '@/components/WebViewAccept';
import { TERMS_AND_CONDITIONS_URL } from '@/const';
import { sharedStyles } from '@/sharedStyles';

export default function TermsAndConditionsScreen() {
  const { t } = useTranslation();
  return (
    <Background>
      <SafeAreaView style={sharedStyles.wrapper}>
        <Header title={t('screens.termsAndConditions.title')} />
        <WebViewAccept url={TERMS_AND_CONDITIONS_URL} />
      </SafeAreaView>
    </Background>
  );
}
