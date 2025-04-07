import { RouteProp, useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/blocks/Button';
import { Background } from '@/components/Background';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { SafeAreaKeyboardAvoidingView } from '@/components/SafeAreaKeyboardAvoidingView';
import { sharedStyles } from '@/sharedStyles';

import { ChatsParamList } from './(tabs)/(chats)/_layout';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
  },
  section: {
    flexDirection: 'column',
    gap: 8,
  },
  buttons: {
    flexDirection: 'column',
    gap: 8,
    paddingHorizontal: 16,
  },
});

export default function EditChatModalScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const route = useRoute<RouteProp<ChatsParamList, 'EditChatModalScreen'>>();
  const { chatId } = route.params;

  const onClose = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const onSave = useCallback(() => {
    // Handle save action
  }, []);
  const onDelete = useCallback(() => {
    Alert.alert(
      t('screens.editChatModal.deleteConfirmation.title'),
      t('screens.editChatModal.deleteConfirmation.message'),
      [
        {
          text: t('screens.editChatModal.deleteConfirmation.cancel'),
          style: 'cancel',
        },
        {
          text: t('screens.editChatModal.deleteConfirmation.confirm'),
          onPress: () => {
            // Handle delete action
          },
        },
      ],
      { cancelable: true },
    );
  }, [t]);

  return (
    <Background>
      <Header
        title={t('screens.editChatModal.title')}
        withBackButton={false}
        rightButtonIcon="close"
        onRightButtonPress={onClose}
      />
      <SafeAreaKeyboardAvoidingView edges={['bottom']}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={sharedStyles.text}>
              {t('screens.editChatModal.sections.name.label')}
            </Text>
            <Input />
            <Text>{chatId}</Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <Button
            isCTA
            title={t('screens.editChatModal.buttons.save')}
            onPress={onSave}
          />
          <Button
            isGhost
            title={t('screens.editChatModal.buttons.delete')}
            onPress={onDelete}
          />
        </View>
      </SafeAreaKeyboardAvoidingView>
    </Background>
  );
}
