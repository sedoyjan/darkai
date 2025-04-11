import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { apiClient } from '@/api';
import { Button } from '@/blocks/Button';
import { Separator } from '@/blocks/Separator';
import { Background } from '@/components/Background';
import { Header } from '@/components/Header';
import { SettingsButton } from '@/components/SettingsButton';
import { Colors } from '@/constants/Colors';
import {
  selectHasActiveSubscription,
  selectHasFreeRequests,
  selectIsAnonymous,
  selectIsAuthenticated,
  selectIsOnboardingPassed,
  selectIsOnboardingSkipped,
  selectIsRecordingMode,
  selectLaunchCount,
  selectUser,
} from '@/rdx/app/selectors';
import {
  setHasActiveSubscription,
  setIsOnboardingPassed,
  setIsOnboardingSkipped,
  setIsRecordingMode,
  setLaunchCount,
} from '@/rdx/app/slice';
import { signOutThunk } from '@/rdx/app/thunks';
import { resetChatState } from '@/rdx/chat/slice';
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
  input: {
    fontSize: 16,
    color: Colors.white,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.white,
    padding: 8,
    borderRadius: 4,
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

  const user = useAppSelector(selectUser);
  const hasFreeRequests = useAppSelector(selectHasFreeRequests);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAnonymous = useAppSelector(selectIsAnonymous);

  return (
    <Background>
      <SafeAreaView style={sharedStyles.wrapper}>
        <Header title={t('screens.titles.developerSettings')} withBackButton />
        <ScrollView style={styles.content}>
          <Text style={styles.text}>
            {JSON.stringify(
              {
                hasFreeRequests,
                isAuthenticated,
                isAnonymous,
              },
              null,
              1,
            )}
          </Text>
          <Separator />
          <TextInput style={styles.input} value={user?.uid || ''} />

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
          <SettingsButton
            label={'Make follow up'}
            onPress={() => {
              apiClient.postAdminTestFollowUp();
            }}
            withSeparator
          />
          <SettingsButton
            label={'Force logout'}
            onPress={async () => {
              await dispatch(resetChatState());
              await dispatch(signOutThunk());
              reloadApp();
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
