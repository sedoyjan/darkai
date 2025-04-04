import { StyleSheet, TextInput, View } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
});

export const KeyboardKeeper = () => {
  return (
    <View style={styles.wrapper}>
      <TextInput
        autoFocus
        autoComplete="off"
        autoCorrect={false}
        spellCheck={false}
      />
    </View>
  );
};
