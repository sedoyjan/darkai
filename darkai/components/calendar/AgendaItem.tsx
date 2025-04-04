import { useRouter } from 'expo-router';
import isEmpty from 'lodash/isEmpty';
import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/Colors';

interface ItemProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO fix any
  item: any;
}

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    flexDirection: 'row',
  },
  itemHourText: {
    color: Colors.primaryText,
  },
  itemDurationText: {
    color: Colors.primaryText,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  itemTitleText: {
    color: Colors.primaryText,
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 16,
    flexShrink: 1,
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  emptyItemText: {
    color: Colors.primaryText,
    fontSize: 14,
  },
});

export const AgendaItem = memo(({ item }: ItemProps) => {
  console.log('AgendaItem', item);
  const router = useRouter();
  const { t } = useTranslation();

  const itemPressed = useCallback(() => {
    router.push(`/(tabs)/(tasks)/${item.id}`);
  }, [item, router]);

  if (isEmpty(item)) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>
          {t('calendar.agendaItem.noEventsToday')}
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={itemPressed} style={styles.item}>
      <View>
        <Text style={styles.itemHourText}>{item.hour}</Text>
      </View>
      <Text style={styles.itemTitleText}>{item.title}</Text>
    </TouchableOpacity>
  );
});
