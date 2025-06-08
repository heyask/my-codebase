import React, { useEffect, useState } from 'react';
import { CellContext } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { Button } from '../button';
import { map } from 'lodash';

export function DropdownCell<TData, TValue>({
  getValue,
  row,
  column,
  table,
  cell,
  ...props
}: CellContext<TData, TValue>) {
  const initialValue = getValue<TValue>();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialValue);
  const disabled =
    table.options.meta?.isLoading || column.columnDef.meta?.disabled;

  useEffect(() => {
    if (!table.options.meta?.isRefetching) setValue(initialValue);
  }, [initialValue, table.options.meta?.isRefetching]);

  return (
    <DropdownMenu open={open} onOpenChange={(open) => setOpen(open)}>
      <DropdownMenuTrigger
        asChild
        className="w-full bg-transparent px-0"
        disabled={disabled}
        onKeyDown={async (e) => {
          switch (e.key) {
            case 'Escape':
              setValue(initialValue);
              props?.onChange?.(initialValue, true);
              break;
          }
        }}
      >
        <Button
          variant="outline"
          className="w-full text-foreground bg-transparent"
        >
          {column.columnDef.meta?.getLabel?.({ row, value })}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-0">
        {map(column.columnDef.meta?.getOptions?.(), (groupOptions, group) => {
          const optionComponents = map(groupOptions, (option) => {
            return (
              <DropdownMenuItem
                key={`${row.id}-${cell.id}-${option}`}
                disabled={disabled}
                onClick={async (e) => {
                  // e.preventDefault();
                  // setOpen(false);
                  setValue(option);
                  // await props?.onChange?.(option, true);
                  await props?.onUpdate?.(option);
                }}
              >
                {column.columnDef.meta?.getLabel?.({ row, value: option })}
              </DropdownMenuItem>
            );
          });
          return group ? (
            <DropdownMenuGroup content={'a'} key={`${group}`}>
              {optionComponents}
            </DropdownMenuGroup>
          ) : (
            optionComponents
          );
        })}
        {/*{column.columnDef.meta?.getOptions?.().map((value) => (*/}
        {/*  <DropdownMenuItem*/}
        {/*    key={value}*/}
        {/*    onClick={(e) => {*/}
        {/*      setValue(value);*/}
        {/*      props?.onChange?.(value);*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    {column.columnDef.meta?.getLabel?.(value)}*/}
        {/*  </DropdownMenuItem>*/}
        {/*))}*/}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
