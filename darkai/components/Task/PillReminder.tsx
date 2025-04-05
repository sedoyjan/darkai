import { formatDistance } from 'date-fns';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useTimerKey } from '@/hooks/useTimerKey';
import { DATE_LOCALES, useLanguage } from '@/i18n';

import { Icon } from '../../blocks/Icon';

interface PillReminderProps {
  date?: number;
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

export const PillReminder = memo(({ date }: PillReminderProps) => {
  const key = useTimerKey(1000 * 30, `reminder-${date}`);
  const language = useLanguage();

  if (!date) {
    return null;
  }
  return (
    <View style={styles.wrapper}>
      <Icon name="alarm" color="white" size={14} />
      <Text style={styles.caption} key={key}>
        {formatDistance(new Date(date), new Date(), {
          addSuffix: true,
          locale: DATE_LOCALES[language],
        })}
      </Text>
    </View>
  );
});

PillReminder.displayName = 'PillReminder';
