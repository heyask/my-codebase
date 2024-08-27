import React, { useState } from 'react';
import { CellContext, Table } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { Button } from '../button';
import { MoreHorizontalIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../alert-dialog';

export function ActionsHeaderCell<T>({ table }: { table: Table<T> }) {
  return <span />;
}

export function ActionsCell<TData, TValue>({
  table,
  row,
}: CellContext<TData, TValue>) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const ref = React.useRef<HTMLButtonElement>(null);

  return (
    <DropdownMenu
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full h-full p-0">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {table.options.meta?.createRow && (
          <DropdownMenuItem
            onClick={async (e) => {
              await table.options.meta?.createRow?.({ row });
            }}
          >
            복제
          </DropdownMenuItem>
        )}
        {table.options.meta?.deleteRows && (
          <AlertDialog
            open={dialogOpen}
            onOpenChange={(open) => {
              if (!open) {
                setDropdownOpen(false);
              }
              setDialogOpen(open);
            }}
          >
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  setDialogOpen(true);
                }}
              >
                삭제
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말 삭제할까요?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 작업은 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant="destructive"
                    isLoading={table.options.meta?.isLoading}
                    onClick={async (e) => {
                      await table.options.meta?.deleteRows?.({
                        rows: [row],
                      });
                      setDialogOpen(false);
                    }}
                  >
                    삭제
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
