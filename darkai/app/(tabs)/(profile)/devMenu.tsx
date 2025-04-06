import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Background } from '@/components/Background';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { SettingsButton } from '@/components/SettingsButton';
import {
  selectHasActiveSubscription,
  selectIsOnboardingPassed,
  selectIsOnboardingSkipped,
  selectIsRecordingMode,
  selectLaunchCount,
} from '@/rdx/app/selectors';
import {
  setHasActiveSubscription,
  setIsOnboardingPassed,
  setIsOnboardingSkipped,
  setIsRecordingMode,
  setLaunchCount,
} from '@/rdx/app/slice';
import { persistor, useAppDispatch, useAppSelector } from '@/rdx/store';
import { sharedStyles } from '@/sharedStyles';
import { reloadApp } from '@/utils/reloadApp';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  action: {
    paddingHorizontal: 16,
  },
});

export default function DeveloperSettingsScreen() {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const hasActiveSubscription = useAppSelector(selectHasActiveSubscription);
  const isRecordingMode = useAppSelector(selectIsRecordingMode);
  const isOnboardingPassed = useAppSelector(selectIsOnboardingPassed);
  const isOnboardingSkipped = useAppSelector(selectIsOnboardingSkipped);
  const launchCount = useAppSelector(selectLaunchCount);

  return (
    <Background>
      <SafeAreaView style={sharedStyles.wrapper}>
        <Header title={t('screens.titles.developerSettings')} withBackButton />
        <ScrollView style={styles.content}>
          <SettingsButton
            label={t('screens.developerSettings.toggleSubscription')}
            onPress={() => {
              dispatch(
                setHasActiveSubscription({
                  hasActiveSubscription: !hasActiveSubscription,
                }),
              );
            }}
            value={hasActiveSubscription}
            withSeparator
          />
          <SettingsButton
            label={t('screens.developerSettings.recordingMode')}
            onPress={() => {
              dispatch(
                setIsRecordingMode({
                  isRecordingMode: !isRecordingMode,
                }),
              );
            }}
            value={isRecordingMode}
            withSeparator
          />

          <SettingsButton
            label={t('screens.developerSettings.clearLaunchCount')}
            // eslint-disable-next-line react/jsx-no-literals
            rightCaption={`launch count: ${launchCount}`}
            onPress={() => {
              dispatch(setLaunchCount({ count: 0 }));
            }}
            withSeparator
          />
          <SettingsButton
            label={t('screens.developerSettings.clearOnboardingState')}
            // eslint-disable-next-line react/jsx-no-literals
            rightCaption={`passed: ${isOnboardingPassed} \nskipped: ${isOnboardingSkipped}`}
            onPress={() => {
              dispatch(setIsOnboardingPassed({ value: false }));
              dispatch(setIsOnboardingSkipped({ value: false }));
            }}
            withSeparator
          />
          <SettingsButton
            label={'Reset persistent state'}
            onPress={() => {
              persistor.purge().then(() => {
                reloadApp();
              });
            }}
            withSeparator
          />
        </ScrollView>
        <View style={styles.action}>
          <Button
            // eslint-disable-next-line react/jsx-no-literals
            title="Restart App"
            onPress={() => {
              reloadApp();
            }}
          />
        </View>
      </SafeAreaView>
    </Background>
  );
}
