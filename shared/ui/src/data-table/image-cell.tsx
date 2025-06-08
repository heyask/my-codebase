import React from 'react';
import { CellContext } from '@tanstack/react-table';
import { ImageWithModal } from '../image-with-modal';
import { NavigationMenuLink } from '../navigation-menu';
import { cn } from '@my-codebase/lib/utils';

export function ImageCell<TData, TValue>({
  getValue,
  row,
  column,
  table,
  ...props
}: CellContext<TData, TValue>) {
  const propsValue = getValue();
  const path = propsValue instanceof Array ? propsValue?.[0] : propsValue;

  return (
    <ImageWithModal
      src={path}
      alt=""
      width={column.columnDef.size}
      height={column.columnDef.size}
      style={{
        maxWidth: column.columnDef.size,
        width: column.columnDef.size,
        height: column.columnDef.size,
      }}
    />
  );
}

// export const ImageCell = React.forwardRef<
//   React.ElementRef<"img">,
//   React.ComponentPropsWithoutRef<"img"> & CellContext<any, any>
// >(({ className, column, getValue, children, ...props }, ref) => {
//   const propsValue = getValue();
//   const path = propsValue instanceof Array ? propsValue?.[0] : propsValue;
//
//   return (
//     <ImageWithModal
//       src={path}
//       alt=""
//       width={column.columnDef.size}
//       height={column.columnDef.size}
//     />
//   );
// });
// ImageCell.displayName = "ImageCell";
