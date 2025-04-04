import { useMemo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

const emojiMap = {
  smile: '😊',
  sad: '😢',
  heart: '❤️',
  robot: '🤖',
  magic: '🪄',
  stars: '✨',
  star: '⭐️',
  priorityLow: '❗️',
  priorityMedium: '❗️❗️',
  priorityHigh: '❗️❗️❗️',
  tada: '🎉',
};

export type EmojiName = keyof typeof emojiMap;
interface EmojiProps {
  name: EmojiName;
  size: number;
  style?: ViewStyle;
}

const styles = StyleSheet.create({
  text: {},
});

export const Emoji = ({ name, size = 24, style }: EmojiProps) => {
  const emoji = emojiMap[name];

  const mergedStyles = useMemo(() => [styles.text, { fontSize: size }], [size]);

  return (
    <View style={style}>
      <Text style={mergedStyles}>{emoji}</Text>
    </View>
  );
};
