import React, { useEffect, useState } from 'react';
import { CellContext } from '@tanstack/react-table';
import { Textarea } from '../textarea';
import { cn } from '@my-workspace/lib/utils';

export function TextareaCell<TData, TValue>({
  getValue,
  row,
  column,
  table,
  ...props
}: CellContext<TData, TValue>) {
  const propsValue = getValue();
  const [value, setValue] = useState(propsValue);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!table.options.meta?.isRefetching) setValue(propsValue);
  }, [propsValue, table.options.meta?.isRefetching]);

  return (
    <Textarea
      value={typeof value !== 'undefined' ? String(value) : ''}
      onChange={(e) => {
        const value = e.target.value;
        setValue(value as TValue);
        // props?.onChange?.(value as TValue);
      }}
      onBlur={async () => {
        if (propsValue !== value) await props?.onUpdate?.(value);
      }}
      onKeyDown={async (e) => {
        switch (e.key) {
          // case "Enter":
          //   if (
          //     document.activeElement?.tagName === "TEXTAREA" ||
          //     document.activeElement?.tagName === "INPUT"
          //   )
          //     return;
          //   await props?.onUpdate?.(value);
          //   // await table.options.meta?.updateRow?.(row.index, column.id, value);
          //   break;
          case 'Escape':
            setValue(propsValue);
            props?.onRevert?.(propsValue);
            break;
        }
      }}
      disabled={table.options.meta?.isLoading}
      className={cn('min-h-9 bg-transparent text-xs py-0.5', {
        'bg-amber-100 border-amber-500': value !== propsValue,
      })}
      rows={1}
      // onFocus={() => setFocused(true)}
    />
  );
}
