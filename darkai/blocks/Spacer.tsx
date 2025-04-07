import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

export const Spacer = () => {
  return <View style={styles.wrapper} />;
};
