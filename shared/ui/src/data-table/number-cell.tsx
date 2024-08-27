import React, { useEffect, useState } from 'react';
import { CellContext } from '@tanstack/react-table';
import { Input } from '../input';
import { NumericFormat } from 'react-number-format';
import { cn } from '@my-workspace/lib/utils';

export function NumberCell<TData, TValue>({
  getValue,
  row,
  column,
  table,
  ...props
}: CellContext<TData, TValue>) {
  const propsValue = getValue();
  const [value, setValue] = useState(propsValue);

  // useEffect(() => {
  //   if (!table.options.meta?.isRefetching) setValue(propsValue);
  // }, [propsValue, table.options.meta?.isRefetching]);

  return (
    <NumericFormat
      className={cn({ 'bg-amber-100 border-amber-500': value !== propsValue })}
      customInput={Input}
      displayType={column.columnDef.meta?.editable ? 'input' : 'text'}
      disabled={
        table.options.meta?.isLoading || column.columnDef.meta?.disabled
      }
      thousandSeparator
      decimalScale={column.columnDef.meta?.decimalScale}
      value={
        value !== null && typeof value !== 'undefined'
          ? String(value).replace(/\.0+$/, '')
          : ''
      }
      onValueChange={({ floatValue, value, formattedValue }) => {
        let _value = typeof floatValue !== 'undefined' ? floatValue : null;
        setValue(_value as TValue);
        // props?.onChange?.(_value);
      }}
      onBlur={async () => {
        if (value !== propsValue) await props?.onUpdate?.(value as TValue);
      }}
      min={column.columnDef.meta?.min}
      max={column.columnDef.meta?.max}
      prefix={column.columnDef.meta?.prefix}
      suffix={column.columnDef.meta?.suffix}
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
            // props?.onRevert?.(propsValue as TValue);
            // props?.onRevert?.(value);
            break;
        }
      }}
    />
  );
}
