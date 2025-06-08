import React, { useEffect, useState } from 'react';
import { CellContext } from '@tanstack/react-table';
import { Input } from '../input';
import { omit } from 'lodash';
import { cn } from '@my-codebase/lib/utils';

export function InputCell<TData, TValue>({
  getValue,
  row,
  column,
  table,
  ...props
}: CellContext<TData, TValue>) {
  const propsValue = getValue();
  const [value, setValue] = useState(propsValue);

  useEffect(() => {
    if (!table.options.meta?.isRefetching) setValue(propsValue);
  }, [propsValue, table.options.meta?.isRefetching]);

  return (
    <Input
      type="text"
      wrapperClassName={cn(column.columnDef.meta?.wrapperClassName)}
      className={cn(
        { 'bg-amber-100 border-amber-500': value !== propsValue },
        column.columnDef.meta?.className
      )}
      style={{
        width: column.columnDef.size,
      }}
      disabled={
        table.options.meta?.isLoading || column.columnDef.meta?.disabled
      }
      value={
        value !== null && typeof value !== 'undefined'
          ? String(value)
          : undefined
      }
      onChange={(e) => {
        const value = e.target.value;
        setValue(value as TValue);
        // props?.onChange?.(value as TValue);
      }}
      onBlur={async () => {
        if (value !== propsValue) props?.onUpdate?.(value as TValue);
      }}
      contentBefore={column.columnDef.meta?.prefix}
      contentAfter={column.columnDef.meta?.suffix}
      onKeyDown={async (e) => {
        switch (e.key) {
          case 'Enter':
            // await table.options.meta?.updateRow?.(
            //   row.index,
            //   column.id,
            //   value,
            // );
            props?.onUpdate?.(value as TValue);
            break;
          case 'Escape':
            setValue(propsValue);
            props?.onRevert?.(propsValue as TValue);
            // props?.onRevert?.(value);
            break;
        }
      }}
      {...omit(props, 'onChange')}
    />
  );
}
