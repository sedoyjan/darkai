import { useCallback } from 'react';

import { BottomSheetContainer } from '@/components/BottomSheetContainer';
import { PriorityPicker } from '@/components/PriorityPicker';
import { useTask } from '@/hooks/useTask';
import { Priority } from '@/types';

export default function PriorityBottomSheetScreen() {
  const { task, updateTask } = useTask();
  const priority = task?.priority || 0;

  const onChange = useCallback(
    (close: () => void) => (value: Priority) => {
      updateTask({ priority: value });
      close();
    },
    [updateTask],
  );

  return (
    <BottomSheetContainer height={230}>
      {close => <PriorityPicker value={priority} onChange={onChange(close)} />}
    </BottomSheetContainer>
  );
}
