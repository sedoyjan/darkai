import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Colors';

import { Icon } from './Icon';

const styles = StyleSheet.create({
  proWrapper: {
    flexDirection: 'row',
    gap: 2,
  },
  proText: {
    fontSize: 14,
    color: Colors.accentColor1,
    fontWeight: '600',
  },
});

export const ProBadge = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.proWrapper}>
      <Icon name="star" size={16} color={Colors.accentColor1} />
      <Text style={styles.proText}>{t('components.proBadge.pro')}</Text>
    </View>
  );
};
