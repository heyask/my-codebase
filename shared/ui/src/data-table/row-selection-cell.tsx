import { Checkbox } from '../checkbox';
import { Label } from '../label';
import React from 'react';
import { CellContext, Row, Table } from '@tanstack/react-table';

export function RowSelectionHeaderCell<T>({ table }: { table: Table<T> }) {
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

export function RowSelectionCell<TData, TValue>({
  getValue,
  row,
  column,
  table,
  ...props
}: CellContext<TData, TValue>) {
  return (
    <Label className="flex items-center justify-center w-full h-full cursor-pointer hover:bg-accent">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
          table.options.meta?.onSelectRows?.({
            // @ts-ignore
            getValue,
            row,
            column,
            table,
            ...props,
          });
        }}
        aria-label="Select row"
      />
    </Label>
  );
}
