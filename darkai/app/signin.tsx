import { RouteProp, useRoute } from '@react-navigation/native';
import { Href, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import logoImage from '@/assets/images/icon.png';
import { Spacer } from '@/blocks/Spacer';
import { AppleSignInButton } from '@/components/AppleSignInButton';
import { Background } from '@/components/Background';
import { CheckBox } from '@/components/CheckBox';
import { Header } from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { selectIsSignInFlowInProgress } from '@/rdx/app/selectors';
import { useChat } from '@/rdx/chat/hooks/useChat';
import {
  selectIsPrivacyAccepted,
  selectIsTermsAccepted,
} from '@/rdx/settings/selectors';
import { setIsPrivacyAccepted, setIsTermsAccepted } from '@/rdx/settings/slice';
import { useAppDispatch, useAppSelector } from '@/rdx/store';
import { sharedStyles } from '@/sharedStyles';

import { RootParamList } from './_layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'regular',
    color: Colors.primaryText,
    marginBottom: 32,
    textAlign: 'center',
  },
  linkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
});

export default function SignInScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isTermsAccepted = useAppSelector(selectIsTermsAccepted);
  const isPrivacyAccepted = useAppSelector(selectIsPrivacyAccepted);
  const route = useRoute<RouteProp<RootParamList, 'SignIn'>>();
  const { text: messageText, chatId, redirectScreen } = route.params;
  const { sendMessage } = useChat(chatId || 'no-chat-id');
  const isSignInFlowInProgress = useAppSelector(selectIsSignInFlowInProgress);

  const onTermsPress = useCallback(() => {
    router.push('/termsModal');
  }, [router]);

  const onTermsCheck = useCallback(
    (value: boolean) => {
      dispatch(setIsTermsAccepted(value));
    },
    [dispatch],
  );

  const onPrivacyPress = useCallback(() => {
    router.push('/privacyModal');
  }, [router]);

  const onRightButtonPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const onPrivacyCheck = useCallback(
    (value: boolean) => {
      dispatch(setIsPrivacyAccepted(value));
    },
    [dispatch],
  );

  const onSignIn = useCallback(async () => {
    if (router.canGoBack()) {
      router.back();
    }
    if (messageText && messageText.length > 0) {
      sendMessage({ text: messageText });
    }
    if (redirectScreen) {
      router.push(redirectScreen as Href);
    }
  }, [messageText, redirectScreen, router, sendMessage]);

  const isButtonEnabled =
    isTermsAccepted && isPrivacyAccepted && !isSignInFlowInProgress;

  return (
    <Background>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Header
          title={t('screens.signin.title')}
          withBackButton={false}
          rightButtonIcon="close"
          onRightButtonPress={onRightButtonPress}
        />
        <Spacer />
        <Image source={logoImage} style={sharedStyles.image} />
        <Text style={styles.title}>{t('screens.signin.welcome')}</Text>
        <Text style={styles.subtitle}>{t('screens.signin.subtitle')}</Text>
        <Spacer />
        <Spacer />

        <View style={styles.linkWrapper}>
          <CheckBox onChange={onTermsCheck} value={isTermsAccepted} />
          <Text style={sharedStyles.text}>
            {t('screens.signin.imAgreeWith')}
            <Text style={sharedStyles.link} onPress={onTermsPress}>
              {t('screens.signin.termsAndConditions')}
            </Text>
          </Text>
        </View>
        <View style={styles.linkWrapper}>
          <CheckBox onChange={onPrivacyCheck} value={isPrivacyAccepted} />
          <Text style={sharedStyles.text}>
            {t('screens.signin.imAgreeWith')}
            <Text style={sharedStyles.link} onPress={onPrivacyPress}>
              {t('screens.signin.privacyPolicy')}
            </Text>
          </Text>
        </View>
        {['ios', 'macos'].includes(Platform.OS) ? (
          <AppleSignInButton
            callback={onSignIn}
            isDisabled={!isButtonEnabled}
          />
        ) : null}
      </SafeAreaView>
    </Background>
  );
}
