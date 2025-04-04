import { RootState } from '..';

export const selectNewTask = (state: RootState) => state.newTask.task;
