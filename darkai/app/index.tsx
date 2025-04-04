import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Background } from '@/components/Background';
import { Colors } from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function IndexScreen() {
  return (
    <Background>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ActivityIndicator size="large" color={Colors.primaryText} />
      </SafeAreaView>
    </Background>
  );
}
