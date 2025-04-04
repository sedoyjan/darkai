import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

import { apiClient } from '@/api';
import { Background } from '@/components/Background';
import { Header } from '@/components/Header';
import { SettingsButton } from '@/components/SettingsButton';
import { Lang, LANGUAGES } from '@/i18n';
import { setLanguageCode } from '@/rdx/app/slice';
import { useAppDispatch } from '@/rdx/store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  list: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 16,
  },
});

export default function LanguagesScreen() {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const selecredLanguage = i18n.language;

  const onSelectLanguage = useCallback(
    (language: Lang) => async () => {
      LocaleConfig.defaultLocale = language.key;
      i18n.changeLanguage(language.key);
      dispatch(
        setLanguageCode({
          languageCode: language.key,
        }),
      );
      apiClient.postUserUpdateLocale({
        locale: language.key,
      });
    },
    [dispatch, i18n],
  );

  const renderItem: ListRenderItem<Lang> = useCallback(
    ({ item: language }) => {
      return (
        <SettingsButton
          label={language.value}
          key={language.key}
          onPress={onSelectLanguage(language)}
          withSeparator
          value={selecredLanguage === language.key}
          isCheckbox
        />
      );
    },
    [onSelectLanguage, selecredLanguage],
  );

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <Header title={t('screens.languages.title')} />
        <FlatList
          data={LANGUAGES}
          renderItem={renderItem}
          style={styles.list}
        />
      </SafeAreaView>
    </Background>
  );
}
