import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

import { Background } from '@/components/Background';
import { Colors } from '@/constants/Colors';
import { usePreviousWithInitialValue } from '@/hooks/usePrevious';
import { setIsOnboardingPassed, setIsOnboardingSkipped } from '@/rdx/app/slice';
import { useAppDispatch } from '@/rdx/store';

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
    marginTop: -150,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
});

export default function OnboardingScreen() {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const router = useRouter();
  const isFocused = useIsFocused();
  const isFocusedPrev = usePreviousWithInitialValue(isFocused);

  const pages = useMemo(() => {
    return [
      {
        backgroundColor: 'transparent',
        image: (
          <Image
            style={styles.image}
            source={require('../assets/images/onboarding/welcome.png')}
          />
        ),

        title: t('screns.onboarding.welcome.title'),
        subtitle: t('screns.onboarding.welcome.subtitle'),
      },
      {
        backgroundColor: 'transparent',
        image: (
          <Image
            style={styles.image}
            source={require('../assets/images/onboarding/organize.png')}
          />
        ),
        title: t('screns.onboarding.organize.title'),
        subtitle: t('screns.onboarding.organize.subtitle'),
      },
      {
        backgroundColor: 'transparent',
        image: (
          <Image
            style={styles.image}
            source={require('../assets/images/onboarding/progress.png')}
          />
        ),
        title: t('screns.onboarding.progress.title'),
        subtitle: t('screns.onboarding.progress.subtitle'),
      },
      {
        backgroundColor: 'transparent',
        image: (
          <Image
            style={styles.image}
            source={require('../assets/images/onboarding/reminders.png')}
          />
        ),
        title: t('screns.onboarding.reminders.title'),
        subtitle: t('screns.onboarding.reminders.subtitle'),
      },
      // {
      //   backgroundColor: 'transparent',
      //   image: (
      //     <Image
      //       style={styles.image}
      //       source={require('../assets/images/onboarding/premium.png')}
      //     />
      //   ),
      //   title: t('screns.onboarding.premium.title'),
      //   subtitle: t('screns.onboarding.premium.subtitle'),
      // },
    ];
  }, [t]);

  const onDone = useCallback(() => {
    dispatch(setIsOnboardingPassed({ value: true }));
    if (router.canGoBack()) {
      router.back();
    }
  }, [dispatch, router]);

  const onSkip = useCallback(() => {
    dispatch(setIsOnboardingSkipped({ value: true }));
    if (router.canGoBack()) {
      router.back();
    }
  }, [dispatch, router]);

  useEffect(() => {
    if (isFocusedPrev && !isFocused) {
      onSkip();
    }
  }, [isFocused, isFocusedPrev, onSkip]);

  return (
    <Background>
      <Onboarding pages={pages} onDone={onDone} onSkip={onSkip} />
    </Background>
  );
}
