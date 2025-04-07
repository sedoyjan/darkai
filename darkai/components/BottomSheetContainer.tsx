import { useRouter } from 'expo-router';
import { ReactNode, useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Colors } from '@/constants/Colors';

import { Icon } from '../blocks/Icon';
import { Background } from './Background';

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  button: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlap: {
    ...StyleSheet.absoluteFillObject,
    bottom: -200,
  },
  overlapOffset: {
    paddingBottom: 200,
  },
});

interface BottomSheetContainerProps {
  withHeader?: boolean;
  children: ReactNode | ((onClose: () => Promise<void>) => ReactNode);
  height?: number;
  onClose?: () => void | Promise<void>;
}

export const BottomSheetContainer = ({
  withHeader = false,
  children,
  height = 200,
}: BottomSheetContainerProps) => {
  const router = useRouter();

  const closeSheet = useCallback(() => {
    // Keyboard.dismiss();
    router.back();
    return new Promise<void>(resolve => {
      resolve();
    });
  }, [router]);

  const isChildrenFunction = typeof children === 'function';

  const wrapperStyles = useMemo<ViewStyle>(() => {
    return {
      position: 'relative',
      height,
    };
  }, [height]);

  return (
    <View style={wrapperStyles}>
      <View style={styles.overlap}>
        <Background style={styles.overlapOffset}>
          {withHeader && (
            <View style={styles.header}>
              <TouchableOpacity onPress={closeSheet} style={styles.button}>
                <Icon name="close-circle" size={24} color={Colors.semiWhite} />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.wrapper}>
            {isChildrenFunction ? children(closeSheet) : children}
          </View>
        </Background>
      </View>
    </View>
  );
};
