import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useAppSelector } from '@/rdx/store';

import {
  selectIsOnboardingPassed,
  selectIsOnboardingSkipped,
} from '../selectors';

export const useOnboardingRedirect = () => {
  const router = useRouter();
  const isFocused = useIsFocused();
  const isOnboardingPassed = useAppSelector(selectIsOnboardingPassed);
  const isOnboardingSkipped = useAppSelector(selectIsOnboardingSkipped);
  const shouldShowOnboarding = !isOnboardingPassed && !isOnboardingSkipped;

  useEffect(() => {
    if (isFocused && shouldShowOnboarding) {
      router.push('/onboardingModal');
    }
  }, [isFocused, router, shouldShowOnboarding]);
};
