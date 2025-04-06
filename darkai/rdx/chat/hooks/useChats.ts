import { useDeepCompare } from '@/hooks/useDeepCompare';
import { useAppSelector } from '@/rdx/store';

import { selectChats } from '../selectors';

export const useChats = () => {
  const chats = useAppSelector(selectChats);
  return useDeepCompare(chats);
};
