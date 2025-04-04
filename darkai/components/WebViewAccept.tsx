import { View } from 'moti';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';

interface WebViewAcceptProps {
  url: string;
  onAccept?: () => void;
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: Colors.transparent,
    marginHorizontal: 16,
  },
  button: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
});

export const WebViewAccept = ({ onAccept, url }: WebViewAcceptProps) => {
  const { t } = useTranslation();
  const source = useMemo(() => ({ uri: url }), [url]);
  return (
    <>
      <WebView style={styles.webview} source={source} />
      {onAccept ? (
        <View style={styles.button}>
          <Button onPress={onAccept} title={t('common.accept')} />
        </View>
      ) : null}
    </>
  );
};
