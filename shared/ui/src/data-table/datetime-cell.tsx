import React, { useEffect, useState } from 'react';
import { CellContext } from '@tanstack/react-table';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Button } from '../button';
import { cn } from '@my-workspace/lib/utils';
import { CalendarIcon } from 'lucide-react';
import dayjs from 'dayjs';
import { Calendar } from '../calendar';

export function DatetimeCell<TData, TValue>({
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

  return column.columnDef.meta?.editable ? (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            dayjs(String(value)).format(
              column.columnDef.meta?.format || 'YYYY-MM-DD'
            )
          ) : (
            <span />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dayjs(String(value)).toDate()}
          onSelect={async (_, selectedDate) => {
            if (selectedDate !== propsValue)
              props?.onUpdate?.(
                dayjs(selectedDate).format('YYYY-MM-DD HH:mm:ss')
              );
          }}
          disabled={(date) => date < new Date('1900-01-01')}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  ) : value ? (
    dayjs(String(value)).format(column.columnDef.meta?.format || 'YYYY-MM-DD')
  ) : (
    ''
  );
}
