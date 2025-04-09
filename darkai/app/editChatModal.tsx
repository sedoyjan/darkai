import { RouteProp, useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/blocks/Button';
import { Background } from '@/components/Background';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { SafeAreaKeyboardAvoidingView } from '@/components/SafeAreaKeyboardAvoidingView';
import { useChat } from '@/rdx/chat/hooks/useChat';
import { deleteChatThunk, renameChatThunk } from '@/rdx/chat/thunks';
import { useAppDispatch } from '@/rdx/store';
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
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const route = useRoute<RouteProp<ChatsParamList, 'EditChatModalScreen'>>();
  const { chatId } = route.params;
  const { title } = useChat(chatId);
  const [chatTitle, setChatTitle] = useState(title);

  const hasChamgedTitle = chatTitle !== title;
  const isValidTitle = chatTitle.length > 0;
  const isValid = hasChamgedTitle && isValidTitle;

  const onClose = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const onSave = useCallback(async () => {
    await dispatch(
      renameChatThunk({
        chatId,
        title: chatTitle,
      }),
    );
    router.back();
  }, [chatId, chatTitle, dispatch, router]);

  const onConfirmedDelete = useCallback(async () => {
    router.back();
    router.back();
    dispatch(deleteChatThunk({ chatId }));
  }, [dispatch, chatId, router]);

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
            onConfirmedDelete();
          },
        },
      ],
      { cancelable: true },
    );
  }, [onConfirmedDelete, t]);

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
            <Input value={chatTitle} onChangeText={setChatTitle} />
          </View>
        </View>
        <View style={styles.buttons}>
          <Button
            isDisabled={!isValid}
            isSuccess
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
