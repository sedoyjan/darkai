import { ReactNode, useCallback, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
} from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { sharedStyles } from '@/sharedStyles';

const { height: fullHeight } = Dimensions.get('window');

interface SafeAreaKeyboardAvoidingViewProps {
  children: ReactNode;
  edges?: Edge[];
  noBottomBar?: boolean;
  tabBarHeight?: number;
}

export const SafeAreaKeyboardAvoidingView = ({
  children,
  edges,
  tabBarHeight,
}: SafeAreaKeyboardAvoidingViewProps) => {
  const [screenOffset, setScreenOffset] = useState<number>(0);

  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) => {
      // setScreenOffset(fullHeight - height - insets.bottom);
      setScreenOffset(fullHeight - height);
    },
    [],
  );

  return (
    <SafeAreaView
      style={sharedStyles.wrapper}
      onLayout={onLayout}
      edges={edges}
    >
      <KeyboardAvoidingView
        style={sharedStyles.wrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
        keyboardVerticalOffset={screenOffset - (tabBarHeight || 0)}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
