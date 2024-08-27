import React from 'react';
import { type ClassValue } from 'clsx';
import { Icon } from './icon';
import { cn } from '@my-workspace/lib/utils';

type Props = {
  className?: ClassValue;
};
export function Loader({ className }: Props) {
  return (
    <Icon
      icon="lucide:loader"
      className={cn('h-4 w-4 animate-spin', className)}
    />
  );
}
