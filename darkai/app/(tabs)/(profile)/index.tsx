import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { apiClient } from '@/api';
import { Button } from '@/blocks/Button';
import { Background } from '@/components/Background';
import { Header } from '@/components/Header';
import { Helper } from '@/components/Helper';
import { SettingsButton } from '@/components/SettingsButton';
import { Colors, PremiumGradientColors } from '@/constants/Colors';
import { LANGUAGES } from '@/i18n';
import { useProfileNavigation } from '@/rdx/app/hooks/useProfileNavigation';
import {
  selectHasActiveSubscription,
  selectIsDeveloper,
  selectUser,
} from '@/rdx/app/selectors';
import { deleteAccountThunk, signOutThunk } from '@/rdx/app/thunks';
import { resetChatState } from '@/rdx/chat/slice';
import { persistor, useAppDispatch, useAppSelector } from '@/rdx/store';
import { toast } from '@/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 16,
    marginTop: 24,
  },
  inner: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    gap: 16,
  },
  center: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  premiumWrapper: {
    width: 100,
    height: 100,
    padding: 10,
    borderRadius: 50,
    position: 'relative',
  },
  premiumGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 50,
  },
  initialsWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gradientEnd,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  initials: {
    color: Colors.primaryText,
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    color: Colors.primaryText,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  email: {
    color: Colors.primaryText,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  actions: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
});

export default function ProfileScreen() {
  const { t } = useTranslation();
  const isDeveloper = useAppSelector(selectIsDeveloper);
  const hasActiveSubscription = useAppSelector(selectHasActiveSubscription);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    onChangeLanguage,
    onSignIn,
    onSubscribe,
    openPrivacyPolicy,
    openTerms,
  } = useProfileNavigation();

  const currentUser = useAppSelector(selectUser);
  const user = currentUser && !currentUser.isAnonymous ? currentUser : null;

  const onRateApp = useCallback(async () => {
    if (await StoreReview.hasAction()) {
      StoreReview.requestReview();
    }
  }, []);

  const onClearData = useCallback(async () => {
    Alert.alert('Clear data', 'Are you sure you want to clear all data?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await apiClient.deleteChatDeleteAllChats();
          dispatch(resetChatState());
        },
      },
    ]);
  }, [dispatch]);

  const onFlush = useCallback(async () => {
    await persistor.purge();
    await persistor.flush();
    dispatch(resetChatState());
  }, [dispatch]);

  const onSignOut = useCallback(async () => {
    await onFlush();
    dispatch(signOutThunk());
  }, [dispatch, onFlush]);

  const onDeleteAccountConfirmed = useCallback(async () => {
    await dispatch(deleteAccountThunk()).unwrap();
    onFlush();
  }, [dispatch, onFlush]);

  const onDeleteAccount = useCallback(async () => {
    Alert.alert(
      t('screens.profile.deleteAccount.title'),
      t('screens.profile.deleteAccount.description'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: onDeleteAccountConfirmed,
        },
      ],
    );
  }, [onDeleteAccountConfirmed, t]);

  const initials = user?.email?.charAt(0).toUpperCase();
  const name = user?.displayName;

  return (
    <Background>
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title={t('screens.profile.title')} withBackButton={false} />

        {user ? (
          <View style={styles.center}>
            <View style={styles.premiumWrapper}>
              {hasActiveSubscription ? (
                <LinearGradient
                  colors={PremiumGradientColors}
                  style={styles.premiumGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              ) : null}
              <View style={styles.initialsWrapper}>
                <Text style={styles.initials}>{initials}</Text>
              </View>
            </View>
            {name ? (
              <>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.email}>{user.email}</Text>
              </>
            ) : (
              <Text style={styles.name}>{user.email}</Text>
            )}
          </View>
        ) : (
          <View style={styles.inner}>
            <Helper
              emoji="robot"
              isVisible
              title={t('screens.profile.robot.title')}
              text={t('screens.profile.robot.text')}
              withCloseButton={false}
            >
              <Button
                title={t('screens.profile.signInButton.label')}
                onPress={onSignIn}
                isSuccess
              />
            </Helper>
          </View>
        )}
        <ScrollView style={styles.content}>
          {LANGUAGES.length > 1 ? (
            <SettingsButton
              icon="language-outline"
              label={t('screens.profile.buttons.changeLanguage')}
              onPress={onChangeLanguage}
              withSeparator
              withArrow
            />
          ) : null}
          <SettingsButton
            icon="star"
            label={t('screens.profile.buttons.rateApp')}
            onPress={onRateApp}
            withSeparator
          />
          <SettingsButton
            icon="document"
            label={t('screens.profile.buttons.privacyPolicy')}
            onPress={openPrivacyPolicy}
            withSeparator
            withArrow
          />
          <SettingsButton
            icon="document"
            label={t('screens.profile.buttons.terms')}
            onPress={openTerms}
            withSeparator
            withArrow
          />
          {user ? (
            <SettingsButton
              icon="trash"
              label={t('screens.profile.buttons.clearData')}
              onPress={onClearData}
              withSeparator
            />
          ) : null}
          {user ? (
            <SettingsButton
              // iconBackgroundColor={Colors.errorColor}
              icon="trash"
              label={t('screens.profile.buttons.deleteAccount')}
              onPress={onDeleteAccount}
              withSeparator
            />
          ) : null}
          {user ? (
            <SettingsButton
              icon="log-out"
              label={t('screens.profile.buttons.signOut')}
              onPress={onSignOut}
            />
          ) : null}
          {isDeveloper ? (
            <SettingsButton
              icon="settings"
              label={t('screens.profile.buttons.devMenu')}
              onPress={() => {
                router.push('/devMenu');
              }}
            />
          ) : null}
        </ScrollView>
        {!hasActiveSubscription && user ? (
          <View style={styles.actions}>
            <Button
              title={t('screens.profile.buttons.subscribe')}
              onPress={onSubscribe}
              isSuccess
            />
          </View>
        ) : null}
      </SafeAreaView>
    </Background>
  );
}
