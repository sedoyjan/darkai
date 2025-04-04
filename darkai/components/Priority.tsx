import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Colors';

import { Icon } from './Icon';

interface PriorityProps {
  value: number;
  withText?: boolean;
}

const styles = StyleSheet.create({
  wrapper: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  caption: {
    color: Colors.primaryText,
    fontSize: 12,
  },
});

export const Priority = ({ value, withText }: PriorityProps) => {
  const { t } = useTranslation();
  const wrapperStyle = useMemo(() => {
    if (withText) {
      return [styles.wrapper, { width: undefined, height: undefined, gap: 4 }];
    }
    return styles.wrapper;
  }, [withText]);

  switch (value) {
    case 1:
      return (
        <View style={wrapperStyle}>
          <Icon
            name="flag"
            color={Colors.accentColor2}
            size={withText ? 14 : 16}
          />
          {withText ? (
            <Text style={styles.caption}>{t('components.priority.low')}</Text>
          ) : null}
        </View>
      );
    case 2:
      return (
        <View style={wrapperStyle}>
          <Icon
            name="flag"
            color={Colors.accentColor1}
            size={withText ? 14 : 16}
          />
          {withText ? (
            <Text style={styles.caption}>
              {t('components.priority.medium')}
            </Text>
          ) : null}
        </View>
      );
    case 3:
      return (
        <View style={wrapperStyle}>
          <Icon
            name="flag"
            color={Colors.errorColor}
            size={withText ? 14 : 16}
          />
          {withText ? (
            <Text style={styles.caption}>{t('components.priority.high')}</Text>
          ) : null}
        </View>
      );
    default:
      return null;
  }
};
