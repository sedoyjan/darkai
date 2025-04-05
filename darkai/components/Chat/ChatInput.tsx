import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Image from 'react-native-fast-image';

import { IconButton } from '@/blocks/IconButton';
import { Colors } from '@/constants/Colors';

import { Input } from '../Input';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 16,
  },
  inner: {
    flexDirection: 'row',
    flexGrow: 1,
  },
  input: {
    paddingHorizontal: 12,
    flex: 1,
  },
  imageWrapper: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    borderRadius: 8,
    marginRight: 8,
    position: 'relative',
  },
  image: {
    width: 42,
    height: 42,
    borderRadius: 8,
  },
  imageButtonWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
    borderRadius: 8,
  },
});

interface ChatInputProps {
  withImageSupport?: boolean;
  isDisabled?: boolean;
  imageUri?: string;
  onSendTextMessage: (text: string) => void;
  onCameraPress?: () => void;
  onDeleteImage?: () => void;
}

export const ChatInput = ({
  withImageSupport = false,
  isDisabled,
  imageUri,
  onSendTextMessage,
  onCameraPress,
  onDeleteImage,
}: ChatInputProps) => {
  const [text, setText] = useState('');

  const isTextEmpty = text.trim().length === 0;
  const isSendButtonDisabled = (isTextEmpty && !imageUri) || isDisabled;

  const clearText = useCallback(() => {
    setText('');
  }, []);

  const onSubmitEditing = useCallback(() => {
    onSendTextMessage(text);
    clearText();
  }, [clearText, onSendTextMessage, text]);

  return (
    <View style={styles.wrapper}>
      {withImageSupport ? (
        <>
          <IconButton
            onPress={onCameraPress}
            name="camera"
            disabled={isDisabled}
          />

          {imageUri ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <View style={styles.imageButtonWrapper}>
                <IconButton
                  onPress={onDeleteImage}
                  name="close"
                  color={Colors.white}
                />
              </View>
            </View>
          ) : null}
        </>
      ) : null}

      <Input
        editable={!isDisabled}
        wrapperStyle={styles.inner}
        style={styles.input}
        onChangeText={setText}
        value={text}
        onSubmitEditing={isSendButtonDisabled ? undefined : onSubmitEditing}
        blurOnSubmit={false}
        placeholder="Enter your goal"
      />

      <IconButton
        disabled={isSendButtonDisabled}
        onPress={onSubmitEditing}
        name="send"
      />
    </View>
  );
};
