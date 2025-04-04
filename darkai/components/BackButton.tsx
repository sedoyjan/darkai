import { useNavigation } from 'expo-router';

import { IconButton } from './IconButton';

export const BackButton = () => {
  const navigation = useNavigation();

  return <IconButton onPress={navigation.goBack} name="arrow-back" />;
};
