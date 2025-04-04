import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { selectIsRecordingMode } from '@/rdx/app/selectors';
import { useAppSelector } from '@/rdx/store';

const styles = StyleSheet.create({
  statusBar: {
    height: 20,
    backgroundColor: Colors.gradientStart,
  },
});

const SHOW_SPACER = false;

export const RecordModeStatusBar = () => {
  const isRecordingMode = useAppSelector(selectIsRecordingMode);

  return (
    <>
      <StatusBar style="light" hidden={isRecordingMode} />
      {isRecordingMode && SHOW_SPACER ? (
        <View style={styles.statusBar} />
      ) : null}
    </>
  );
};
