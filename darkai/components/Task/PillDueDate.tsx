import { formatDistance } from 'date-fns';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { DATE_LOCALES, useLanguage } from '@/i18n';

import { Icon } from '../../blocks/Icon';

interface PillDueDateProps {
  date: number;
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  caption: {
    color: Colors.primaryText,
    fontSize: 12,
  },
});

export const PillDueDate = memo(({ date }: PillDueDateProps) => {
  const language = useLanguage();
  return (
    <View style={styles.wrapper}>
      <Icon name="calendar" color="white" size={14} />
      <Text style={styles.caption}>
        {formatDistance(new Date(date), new Date(), {
          addSuffix: true,
          locale: DATE_LOCALES[language],
        })}
      </Text>
    </View>
  );
});

PillDueDate.displayName = 'PillDueDate';
