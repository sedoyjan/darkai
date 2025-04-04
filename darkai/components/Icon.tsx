import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export const Icon = Ionicons;
