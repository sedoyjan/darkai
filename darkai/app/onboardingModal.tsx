import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, StyleSheet } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

import { Background } from '@/components/Background';
import { Colors } from '@/constants/Colors';
import { usePreviousWithInitialValue } from '@/hooks/usePrevious';
import { setIsOnboardingPassed, setIsOnboardingSkipped } from '@/rdx/app/slice';
import { useAppDispatch } from '@/rdx/store';

const windowWidth = Dimensions.get('window').width;
const imageSize = windowWidth - 32;

const styles = StyleSheet.create({
  image: {
    width: imageSize,
    height: imageSize,
    marginTop: -imageSize / 2,
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
            source={require('../assets/images/onboarding/Onboarding-1.png')}
          />
        ),

        title: t('screens.onboarding.step1.title'),
        subtitle: t('screens.onboarding.step1.description'),
      },
      {
        backgroundColor: 'transparent',
        image: (
          <Image
            style={styles.image}
            source={require('../assets/images/onboarding/Onboarding-2.png')}
          />
        ),
        title: t('screens.onboarding.step2.title'),
        subtitle: t('screens.onboarding.step2.description'),
      },
      {
        backgroundColor: 'transparent',
        image: (
          <Image
            style={styles.image}
            source={require('../assets/images/onboarding/Onboarding-3.png')}
          />
        ),
        title: t('screens.onboarding.step3.title'),
        subtitle: t('screens.onboarding.step3.description'),
      },
      {
        backgroundColor: 'transparent',
        image: (
          <Image
            style={styles.image}
            source={require('../assets/images/onboarding/Onboarding-4.png')}
          />
        ),
        title: t('screens.onboarding.step4.title'),
        subtitle: t('screens.onboarding.step4.description'),
      },
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
