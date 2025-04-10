import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export const useProfileNavigation = () => {
  const router = useRouter();

  const onChangeLanguage = useCallback(async () => {
    router.push('/languages');
  }, [router]);

  const openPrivacyPolicy = useCallback(async () => {
    router.push('/privacy');
  }, [router]);

  const openTerms = useCallback(async () => {
    router.push('/terms');
  }, [router]);

  const onSubscribe = useCallback(async () => {
    router.push('/subscriptionModal');
  }, [router]);

  const onSignIn = useCallback(async () => {
    router.push('/signin');
  }, [router]);

  return {
    onChangeLanguage,
    openPrivacyPolicy,
    openTerms,
    onSubscribe,
    onSignIn,
  };
};
