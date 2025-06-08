import { Checkbox } from '../checkbox';
import { Label } from '../label';
import React, { useEffect, useState } from 'react';
import { CellContext } from '@tanstack/react-table';
import { LoaderIcon } from 'lucide-react';

export function CheckboxHeaderCell<TData, TValue>({
  table,
}: CellContext<TData, TValue>) {
  return (
    <Label className="flex items-center justify-center w-full h-full cursor-pointer">
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    </Label>
  );
}

export function CheckboxCell<TData, TValue>({
  getValue,
  table,
  ...props
}: CellContext<TData, TValue>) {
  const propsValue = getValue();
  const [value, setValue] = useState(propsValue);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!table.options.meta?.isRefetching) setValue(propsValue);
  }, [propsValue, table.options.meta?.isRefetching]);

  return (
    <Label className="flex items-center justify-center w-full h-full cursor-pointer hover:bg-accent">
      {isUpdating ? (
        <LoaderIcon className="h-4 w-4 animate-spin" />
      ) : (
        <Checkbox
          // checked={!!getValue<TValue>?.()}
          checked={!!value}
          disabled={
            table.options.meta?.isLoading || table.options.meta?.isRefetching
          }
          onCheckedChange={async (value) => {
            setIsUpdating(true);
            // console.log(value);
            // await props?.onChange?.(value);
            await props?.onUpdate?.(value);
            setIsUpdating(false);
          }}
          aria-label="Select row"
        />
      )}
    </Label>
  );
}
