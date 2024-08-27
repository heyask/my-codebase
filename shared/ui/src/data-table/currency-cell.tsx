import React, { useEffect, useState } from 'react';
import { CellContext } from '@tanstack/react-table';
import { NumericFormat } from 'react-number-format';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../tooltip';
import { Input } from '../input';
import { cn } from '@my-workspace/lib/utils';

export function CurrencyCell<TData, TValue>({
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

  // if (value !== propsValue) console.log(value, propsValue);

  return (
    <TooltipProvider delayDuration={0} disableHoverableContent={true}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <NumericFormat
              className={cn({
                'underline decoration-dashed decoration-foreground/50 decoration-1 underline-offset-4 cursor-text':
                  !column.columnDef.meta?.editable,
                'bg-amber-100 border-amber-500': value !== propsValue,
              })}
              displayType={column.columnDef.meta?.editable ? 'input' : 'text'}
              customInput={column.columnDef.meta?.editable ? Input : undefined}
              disabled={
                table.options.meta?.isLoading || column.columnDef.meta?.disabled
              }
              thousandSeparator
              decimalScale={
                column.columnDef.meta?.showOriginal
                  ? undefined
                  : column.columnDef.meta?.currency?.decimalScale
              }
              value={
                value !== null && typeof value !== 'undefined'
                  ? String(value).replace(/\.0+$/, '')
                  : ''
              }
              onValueChange={({ floatValue, value, formattedValue }) => {
                let _value =
                  typeof floatValue !== 'undefined' ? floatValue : null;
                setValue(_value as TValue);
                // props?.onChange?.(floatValue as TValue);
              }}
              onBlur={async () => {
                if (value !== propsValue) props?.onUpdate?.(value as TValue);
              }}
              min={column.columnDef.meta?.min}
              max={column.columnDef.meta?.max}
              // contentBefore={
              //   column.columnDef.meta?.editable
              //     ? column.columnDef.meta?.currency?.symbol
              //     : undefined
              // }
              prefix={
                !column.columnDef.meta?.editable
                  ? column.columnDef.meta?.currency?.symbol
                  : undefined
              }
              // contentAfter={column.columnDef.meta?.suffix}
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
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <div>
            Original:{' '}
            <NumericFormat
              displayType="text"
              thousandSeparator
              prefix={column.columnDef.meta?.currency?.symbol}
              value={String(propsValue)}
            />
          </div>
          <div>
            Exchange Rate: {column.columnDef.meta?.currency?.symbol}1 =
            <NumericFormat
              displayType="text"
              thousandSeparator
              // prefix={AppConstants.CURRENCY.KRW.symbol}
              value={String(column.columnDef.meta?.currency?.exchangeRate)}
            />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
