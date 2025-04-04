import { useTranslation } from 'react-i18next';

import { BottomSheetContainer } from '@/components/BottomSheetContainer';
import { SettingsButton } from '@/components/SettingsButton';
import { selectShowCompletedTasks } from '@/rdx/settings/selectors';
import { setShowCompletedTasks } from '@/rdx/settings/slice';
import { useAppDispatch, useAppSelector } from '@/rdx/store';

export default function OptionsBottomSheetScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const showCompletedTasks = useAppSelector(selectShowCompletedTasks);

  return (
    <BottomSheetContainer height={250} withHeader>
      {_close => (
        <>
          <SettingsButton
            value={showCompletedTasks}
            label={t('screens.options.showCompletedTasks')}
            withSeparator
            onPress={() => {
              dispatch(setShowCompletedTasks(!showCompletedTasks));
            }}
          />
        </>
      )}
    </BottomSheetContainer>
  );
}
