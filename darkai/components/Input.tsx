import { omit } from 'lodash';
import { ForwardedRef, forwardRef, useMemo } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps as RNTextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { Colors } from '@/constants/Colors';

import { Panel } from './Panel';

const styles = StyleSheet.create({
  wrapper: {
    padding: 0,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    flexGrow: 1,
    color: Colors.primaryText,
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  inputMultiline: {
    maxHeight: 96,
    textAlignVertical: 'top',
  },
  counterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  counter: {
    color: Colors.semiWhite,
    fontSize: 12,
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 4,
  },
});

type TextInputProps = RNTextInputProps & {
  wrapperStyle?: ViewStyle;
};

export const Input = forwardRef(
  (props: TextInputProps, ref: ForwardedRef<TextInput>) => {
    const inputStyle = useMemo(() => {
      const passedStyle = (props.style || {}) as ViewStyle;
      const isMultiline = props.multiline ?? false;
      return {
        ...passedStyle,
        ...styles.input,
        ...(isMultiline ? styles.inputMultiline : {}),
        ...(props.maxLength && !isMultiline ? { paddingBottom: 0 } : {}),
      } as StyleProp<TextStyle>;
    }, [props.multiline, props.maxLength, props.style]);

    const restProps = useMemo(() => omit(props, 'style'), [props]);

    const mergedWrapperStyle = useMemo(() => {
      return { ...styles.wrapper, ...props.wrapperStyle };
    }, [props.wrapperStyle]);

    return (
      <Panel style={mergedWrapperStyle}>
        <TextInput
          ref={ref}
          style={inputStyle}
          placeholderTextColor={Colors.placeholder}
          {...restProps}
          autoComplete="off"
          autoCorrect={false}
          spellCheck={false}
          multiline={props.multiline ?? false}
        />
        {props.maxLength ? (
          <View style={styles.counterWrapper}>
            <Text style={styles.counter}>
              {props.maxLength - (props.value?.length || 0)}
            </Text>
          </View>
        ) : null}
      </Panel>
    );
  },
);
