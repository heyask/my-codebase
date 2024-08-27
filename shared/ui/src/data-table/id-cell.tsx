import React, { useEffect, useState } from 'react';
import { CellContext } from '@tanstack/react-table';
import { Input } from '../input';
import { omit } from 'lodash';
import Link from 'next/link';

export function IdCell<TData, TValue>({
  getValue,
  row,
  column,
  table,
  ...props
}: CellContext<TData, TValue>) {
  const propsValue = getValue<TValue>();

  return (
    <Link href={`/${column.columnDef.id}/${propsValue}`} className="link">
      {String(propsValue)}
    </Link>
  );
}
