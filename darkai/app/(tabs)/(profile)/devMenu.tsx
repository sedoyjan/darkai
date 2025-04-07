import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/blocks/Button';
import { Background } from '@/components/Background';
import { Header } from '@/components/Header';
import { SettingsButton } from '@/components/SettingsButton';
import { Colors } from '@/constants/Colors';
import {
  selectHasActiveSubscription,
  selectHasFreeRequests,
  selectIsAuthenticated,
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
  text: {
    fontSize: 16,
    color: Colors.white,
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderColor,
    marginRight: -16,
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

  const hasFreeRequests = useAppSelector(selectHasFreeRequests);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <Background>
      <SafeAreaView style={sharedStyles.wrapper}>
        <Header title={t('screens.titles.developerSettings')} withBackButton />
        <ScrollView style={styles.content}>
          <Text style={styles.text}>Debug Data</Text>
          <Text style={styles.text}>
            {JSON.stringify(
              {
                hasActiveSubscription,
                hasFreeRequests,
                isAuthenticated,
              },
              null,
              1,
            )}
          </Text>
          <View style={styles.separator} />

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
