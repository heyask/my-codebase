'use client';

import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, Header, Row, RowData, SortingState, Table as TanstackTable, TableMeta, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Button } from './button';
import { ArrowDownIcon, ArrowUpIcon, SortAscIcon } from 'lucide-react';
import { cn } from '@my-workspace/lib/utils';
import { cloneDeep, set } from 'lodash-es';
import { PaginationActions } from './data-table/pagination-actions';
import { useSearchParams } from '@my-workspace/lib/hooks/use-search-params';
import { IPage, LimitOptions, SortOptions } from '@my-workspace/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Input } from './input';
import { useRecoilState } from 'recoil';
import { meState } from '@my-workspace/lib/stores/me';
// import { Skeletons, SkeletonsProps } from "../utils/skeletons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
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
} from './alert-dialog';

interface DataTableProps<TData> {
  defaultSorting?: SortingState;
  columns: ColumnDef<TData, any>[];
  data: TData[] | undefined;
  page?: IPage;
  meta?: TableMeta<TData>;
  sortOptionState?: [SortOptions, (sortOptions: SortOptions) => void];
  legend?: ReactNode | undefined;
  renderActions?: (table: TanstackTable<TData>) => ReactNode | undefined;
  renderSelectedActions?: (
    table: TanstackTable<TData>
  ) => ReactNode | undefined;
  renderFilters?: ReactNode | undefined;
  showCreate?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  // skeletons?: SkeletonsProps;
  visiblePageCnt?: number;
  showLimit?: boolean;
}

export type MyTableParam<TData> = {
  rows: Row<TData>[];
};
export type MyCellParam<TData, TValue> = {
  row: Row<TData>;
  value: TValue | undefined;
};
export type MyParam<TData, TValue> = {
  rowData: TData;
  value: TValue;
};

export const TableLayout = {
  Default: 0,
  WithThumbnail: 1,
} as const;
export type TableLayout = (typeof TableLayout)[keyof typeof TableLayout];
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateRows?: (params: MyTableParam<TData>) => Promise<void>;
    deleteRows?: (params: MyTableParam<TData>) => Promise<void>;
    createRow?: (params: { row?: Row<TData> }) => Promise<void>;
    isLoading?: boolean;
    isRefetching?: boolean;
    layout?: TableLayout;
    onSelectRows?: (params: MyTableParam<TData>) => Promise<void>;
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    editable?: boolean;
    type?: string;
    renderEmpty?: (params: MyCellParam<TData, TValue>) => string | ReactNode;
    wrapperClassName?: string;
    className?: string;
    headerClassName?: string;
    mobileHeaderClassName?: string;
    prefix?: string;
    suffix?: string;
    format?: string;
    min?: number;
    max?: number;
    decimalScale?: number;
    currency?: any;
    showOriginal?: boolean;
    disabled?: boolean;
    showHeader?: boolean;
    showLeftOnMobile?: boolean;
    getLabel?: (
      params: MyCellParam<TData, TValue>
    ) => ReactNode | string | undefined;
    getOptionValue?: (params: MyCellParam<TData, TValue>) => string | undefined;
    getKeywords?: (params: MyCellParam<TData, TValue>) => string[];
    getOptions?: () => Record<string, TValue[]>; //{ [key: string]: TValue[] };
    getStyle?: (params: MyCellParam<TData, TValue>) => React.CSSProperties;
    filterOptions?: (
      value: string,
      input: string,
      keywords: string[] | undefined
    ) => number;
    onChange?: (params: MyCellParam<TData, TValue>) => Promise<TData>;
    onRevert?: (params: MyCellParam<TData, TValue>) => Promise<TData>;
    onUpdate?: (params: MyCellParam<TData, TValue>) => Promise<TData>;
  }

  interface CellContext<TData extends RowData, TValue> {
    onChange: (value: any, immediateUpdate?: boolean) => Promise<void>;
    onUpdate: (value: any) => Promise<void>;
    onRevert: (value: any) => Promise<void>;
    // TODO
    getInnerRowData: () => TData;
  }
}

function DataTableInner<TData>(
  {
    columns,
    data: propsData,
    page,
    meta,
    sortOptionState,
    legend,
    renderActions,
    renderSelectedActions,
    renderFilters,
    showCreate = true,
    showHeader = true,
    showSearch = true,
    searchPlaceholder = 'Search',
    showFooter = true,
    defaultSorting,
    // skeletons,
    visiblePageCnt,
    showLimit = true,
    ...options
  }: DataTableProps<TData>,
  ref: React.ForwardedRef<TanstackTable<TData>>
) {
  const [me, setMe] = useRecoilState(meState);
  const [data, setData] = useState<TData[]>(propsData || []);
  const [showBulkUpdateRowsDialog, setShowBulkUpdateRowsDialog] =
    useState(false);
  const [selectedHeader, setSelectedHeader] = useState<Header<TData, any>>();
  const [selectedHeaderValue, setSelectedHeaderValue] = useState<any>();
  const table = useReactTable({
    columns,
    data: propsData || [],
    _features: [],
    getCoreRowModel: getCoreRowModel(),
    // onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    meta,
    // ...omit(options, ["columns", "data"]),
  });
  const selectedCell = useMemo(
    () =>
      table
        .getFilteredSelectedRowModel()
        .rows?.[0]?.getVisibleCells()
        .find(
          (cell) =>
            // @ts-ignore
            cell.column.columnDef.accessorKey ===
            // @ts-ignore
            selectedHeader?.column.columnDef.accessorKey
        ),
    [selectedHeader, table]
  );
  const workerRef = useRef<Worker>();
  const [keyword, setKeyword] = useState('');
  const idleTimeout = 1000;
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChangePage = (newPage: number) => {
    setSearchParams({
      ...searchParams,
      page: String(newPage),
    });
  };

  // useEffect(() => {
  //   // setRender(!render);
  //   // const id = requestIdleCallback(() => setRender(!render), { timeout: idleTimeout });
  //   // return () => cancelIdleCallback(id);
  //   workerRef.current = new Worker(new URL("./worker.ts", import.meta.url));
  //   workerRef.current.onmessage = (event: MessageEvent<number>) =>
  //     alert(`WebWorker Response => ${event.data}`);
  //   return () => {
  //     workerRef.current?.terminate();
  //   };
  // }, [idleTimeout, data]);
  // const handleWork = useCallback(async () => {
  //   workerRef.current?.postMessage(100000);
  // }, []);
  // console.log(22);
  // const [rows, setRows] = useState<Row<TData>[]>(cloneDeep(propsRows));
  useEffect(() => {
    setData(cloneDeep(propsData || []));
  }, [propsData]);

  function useSkipper() {
    const shouldSkipRef = React.useRef(true);
    const shouldSkip = shouldSkipRef.current;

    // Wrap a function with this to skip a pagination reset temporarily
    const skip = React.useCallback(() => {
      shouldSkipRef.current = false;
    }, []);

    React.useEffect(() => {
      shouldSkipRef.current = true;
    });

    return [shouldSkip, skip] as const;
  }

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
  const reRender = React.useReducer(() => ({}), {})[1];
  // useEffect(() => {
  //   setRows(cloneDeep(propsRows));
  // }, [propsRows]);
  // console.log("propsData", propsData);
  // console.log("data", data);
  // const isModified = useMemo(() => {
  //   // cell.row.columnFiltersMeta.isChanged
  //   // table.getrow
  //   return table.getRowModel().rows.some((row) => {
  //     console.log(row.columnFiltersMeta.isChanged);
  //   });
  //   // return !isEqual(data, propsData);
  // }, [data, propsData, table.getRowModel().rows]);
  useEffect(() => {
    if (defaultSorting) {
      table.setSorting((old) => defaultSorting);
    }
  }, [defaultSorting]);

  const isMobile = false;

  return (
    // <div className="grow flex flex-col h-full">
    //
    // </div>
    <React.Fragment>
      <header
        className={cn('flex items-center gap-2', {
          hidden: !showHeader,
        })}
      >
        {/*{isModified && (*/}
        {/*  <>*/}
        {/*    <Button*/}
        {/*      disabled={meta?.isLoading}*/}
        {/*      isLoading={meta?.isLoading}*/}
        {/*      onClick={async (e) => {*/}
        {/*        e.preventDefault();*/}
        {/*        // await updateRows();*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      변경사항 저장*/}
        {/*    </Button>*/}
        {/*    &nbsp;*/}
        {/*  </>*/}
        {/*)}*/}
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <>
            <React.Fragment>
              <span>
                {table.getFilteredSelectedRowModel().rows.length}개의 선택된
                항목을
              </span>
              <Button
                onClick={async (e) => {
                  const rows = table
                    .getFilteredSelectedRowModel()
                    .rows.map((row) => row.original);
                  // await downloadExcelMutateAsync({
                  //   rows: rows,
                  // });
                }}
              >
                엑셀 다운로드
              </Button>
            </React.Fragment>
            {table.options.meta?.updateRows && (
              <AlertDialog
                open={showBulkUpdateRowsDialog}
                onOpenChange={(open) => {
                  if (!open) {
                    setSelectedHeader(undefined);
                    setSelectedHeaderValue(undefined);
                  }
                  setShowBulkUpdateRowsDialog(open);
                }}
              >
                <AlertDialogTrigger asChild>
                  <Button isLoading={meta?.isLoading} variant="outline">
                    일괄수정
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>일괄 수정</AlertDialogTitle>
                    <AlertDialogDescription>
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full">
                              {String(
                                selectedHeader?.column.columnDef.header ||
                                  '수정할 칼럼을 선택해주세요'
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {table.getHeaderGroups()?.map((headerGroup) =>
                              headerGroup.headers
                                ?.filter(
                                  (header) =>
                                    // @ts-ignore
                                    header.column.columnDef.accessorKey
                                )
                                .map((header) => {
                                  return (
                                    <DropdownMenuItem
                                      key={`field-${String(headerGroup.id)}`}
                                      onClick={(e) => {
                                        setSelectedHeader(header);
                                        setSelectedHeaderValue(undefined);
                                      }}
                                    >
                                      {String(header.column.columnDef.header)}
                                    </DropdownMenuItem>
                                  );
                                })
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {/*{selectedHeader &&*/}
                      {/*  table.getRowModel().rows.length > 0 &&*/}
                      {selectedHeader &&
                        selectedCell &&
                        flexRender(selectedHeader.column.columnDef.cell, {
                          ...selectedCell.getContext(),
                          onChange: async (value, immediateUpdate = false) => {
                            setSelectedHeaderValue(value);
                          },
                          onUpdate: async (value) => {
                            setSelectedHeaderValue(value);
                          },
                          onRevert: async (value) => {},
                        })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        disabled={typeof selectedHeaderValue === 'undefined'}
                        onClick={async (e) => {
                          if (
                            !confirm(
                              '이 작업은 되돌릴 수 없습니다. 진행할까요?'
                            )
                          )
                            return;
                          const selectedRows =
                            table.getFilteredSelectedRowModel().rows;
                          const newData = data;
                          for (const selectedRow of selectedRows) {
                            if (selectedCell!.column.columnDef.meta?.onChange) {
                              set(
                                newData,
                                `[${[selectedRow.index]}]`,
                                await selectedCell!.column.columnDef.meta?.onChange(
                                  {
                                    row: {
                                      ...selectedRow,
                                      original: newData[selectedRow.index],
                                    },
                                    value: selectedHeaderValue,
                                  }
                                )
                              );
                            } else {
                              set(
                                newData,
                                // @ts-ignore
                                `[${[selectedRow.index]}]${selectedCell!.column.columnDef.accessorKey}`,
                                selectedHeaderValue
                              );
                            }
                            setData(newData);
                          }
                          await table.options.meta?.updateRows?.({
                            rows: selectedRows.map((selectedRow) => ({
                              ...selectedRow,
                              original: newData[selectedRow.index],
                            })),
                          });
                          setShowBulkUpdateRowsDialog(false);
                        }}
                      >
                        일괄수정
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {table.options.meta?.deleteRows && (
              <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      isLoading={table.options.meta?.isLoading}
                      variant="destructive"
                    >
                      일괄삭제
                    </Button>
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
                      <AlertDialogAction
                        onClick={async (e) => {
                          await table.options.meta?.deleteRows?.({
                            rows: table.getFilteredSelectedRowModel().rows,
                          });
                          table.resetRowSelection();
                        }}
                      >
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            )}
            {renderSelectedActions?.(table)}
          </>
        ) : (
          <React.Fragment>
            {legend}
            {table.options.meta?.createRow && showCreate && (
              <Button
                isLoading={meta?.isLoading}
                onClick={async (e) => {
                  await table.options.meta?.createRow?.({});
                }}
              >
                생성
              </Button>
            )}
            {renderActions?.(table)}
          </React.Fragment>
        )}
        {(renderFilters || showSearch) && <div className="grow" />}
        {renderFilters}
        {showSearch && (
          <React.Fragment>
            <Input
              type="search"
              wrapperClassName="w-80"
              value={keyword}
              placeholder={searchPlaceholder}
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
              onKeyDown={async (e) => {
                switch (e.key) {
                  case 'Enter':
                    setSearchParams({
                      keyword,
                    });
                    break;
                }
              }}
            />
            <Button
              onClick={(e) => {
                setSearchParams({
                  keyword,
                });
              }}
            >
              검색
            </Button>
          </React.Fragment>
        )}
      </header>
      <section className="grow relative rounded-md border overflow-auto">
        <Table className={cn('', { flex: isMobile })}>
          <TableHeader className={cn('sticky top-0', { hidden: isMobile })}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={cn({ 'flex flex-col': isMobile })}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      // className="flex px-0 border-x-2 border-transparent"
                      className={cn(
                        'p-0',
                        header.column.columnDef.meta?.headerClassName
                      )}
                      style={{
                        width: header.getSize ? header.getSize() : undefined,
                      }}
                    >
                      <div
                        className={cn(
                          'flex items-center justify-center hover:bg-accent rounded-md w-full h-full cursor-auto',
                          {
                            'cursor-pointer select-none':
                              header.column.getCanSort(),
                          }
                        )}
                        onClick={
                          header.column.getToggleSortingHandler()
                          // header.column.getCanSort() &&
                          // header.column.toggleSorting(
                          //   header.column.getIsSorted() === "asc",
                          // )
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() &&
                          ({
                            asc: <ArrowUpIcon className="ml-2 h-4 w-4" />,
                            desc: <ArrowDownIcon className="ml-2 h-4 w-4" />,
                          }[header.column.getIsSorted() as string] ?? (
                            <SortAscIcon className="ml-2 h-4 w-4" />
                          ))}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className={cn({ grow: isMobile })}>
            {typeof propsData !== 'undefined' ? (
              propsData.length === data.length ? (
                table.getRowModel().rows.map((row) => {
                  // const row = rows[virtualRow.index] as Row<TData>;
                  return (
                    <TableRow
                      // TODO
                      // @ts-ignore
                      key={row.original.id}
                      data-state={row.getIsSelected() && 'selected'}
                      data-index={row.index}
                      className={cn({
                        'relative flex flex-col gap-1.5 px-4 py-2': isMobile,
                      })}
                      // ref={(node) => rowVirtualizer.measureElement(node)} //
                      // className="flex absolute w-full"
                      // style={{
                      //   transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                      // }}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell
                            key={cell.id}
                            className={cn(
                              // "relative flex justify-center text-center items-center px-0 p-0 border-2 border-transparent",
                              // whitespace-nowrap text-left overflow-hidden
                              'text-center p-0 px-1 overflow-hidden overflow-ellipsis',
                              // TODO 버튼 위아래로 꽉차게 해야함
                              // for mobile
                              'h-auto flex items-stretch w-full sm:table-cell',
                              {
                                'bg-amber-100 border-amber-500': (
                                  (row.columnFiltersMeta.isChanged ||
                                    []) as string[]
                                ).includes(cell.id),
                              },
                              {
                                // TODO
                                'absolute top-0 left-0 w-0 h-0 overflow-visible':
                                  cell.column.columnDef.meta?.showLeftOnMobile,
                              },
                              {
                                // TODO
                                'static top-auto left-auto':
                                  cell.column.columnDef.meta?.showLeftOnMobile,
                              },
                              cell.column.columnDef.meta?.className
                            )}
                            style={{
                              ...(isMobile
                                ? {}
                                : {
                                    width: cell.column.getSize(),
                                    maxWidth: cell.column.getSize(),
                                    minWidth: cell.column.getSize(),
                                  }),
                              ...cell.column.columnDef.meta?.getStyle?.({
                                row: row,
                                value: cell.getValue(),
                              }),
                            }}
                          >
                            {table.options.meta?.layout ===
                              TableLayout.WithThumbnail && (
                              <span className="block w-32" />
                            )}
                            {cell.column.columnDef.header && (
                              <span
                                className={cn(
                                  'block sm:hidden grow text-left text-gray-400',
                                  // {
                                  //   "ml-32":
                                  //     table.options.meta?.layout ===
                                  //     TableLayout.WithThumbnail,
                                  // },
                                  cell.column.columnDef.meta
                                    ?.mobileHeaderClassName
                                )}
                              >
                                {/*@ts-expect-error*/}
                                {cell.column.columnDef.header}
                              </span>
                            )}
                            {cell.column.columnDef.meta?.renderEmpty &&
                            !cell.getValue()
                              ? cell.column.columnDef.meta?.renderEmpty({
                                  row: row,
                                  value: cell.getValue(),
                                })
                              : flexRender(cell.column.columnDef.cell, {
                                  ...cell.getContext(),
                                  // column: {
                                  //   ...cell.getContext().column,
                                  //   columnDef: {
                                  //     ...cell.getContext().column.columnDef,
                                  //     meta: {
                                  //       ...cell.getContext().column.columnDef.meta,
                                  //       className: "asd",
                                  //     },
                                  //   },
                                  // },
                                  getInnerRowData: () => {
                                    // return "";
                                    return data[row.index];
                                  },
                                  onChange: async (
                                    value,
                                    immediateUpdate = false
                                  ) => {
                                    const propValue = cell.getValue();
                                    if (
                                      propValue !== value &&
                                      !(
                                        (cell.row.columnFiltersMeta.isChanged ||
                                          []) as string[]
                                      ).includes(cell.id)
                                    ) {
                                      cell.row.columnFiltersMeta = {
                                        isChanged: [
                                          ...((cell.row.columnFiltersMeta
                                            .isChanged || []) as string[]),
                                          cell.id,
                                        ],
                                      };
                                    } else if (propValue === value) {
                                      cell.row.columnFiltersMeta = {
                                        isChanged: (
                                          (cell.row.columnFiltersMeta
                                            .isChanged || []) as string[]
                                        ).filter((item) => item !== cell.id),
                                      };
                                    }
                                    const newData = data;
                                    if (cell.column.columnDef.meta?.onChange) {
                                      set(
                                        newData,
                                        `[${[row.index]}]`,
                                        await cell.column.columnDef.meta?.onChange(
                                          {
                                            row: {
                                              ...row,
                                              original: newData[row.index],
                                            },
                                            value,
                                          }
                                        )
                                      );
                                    } else {
                                      set(
                                        newData,
                                        // @ts-ignore
                                        `[${[row.index]}]${cell.column.columnDef.accessorKey}`,
                                        value
                                      );
                                    }
                                    setData(newData);

                                    if (immediateUpdate) {
                                      await table.options.meta?.updateRows?.({
                                        rows: [
                                          {
                                            ...row,
                                            original: newData[row.index],
                                          },
                                        ],
                                      });
                                    }
                                    reRender();
                                  },
                                  onUpdate: async (value) => {
                                    const newData = data;
                                    if (cell.column.columnDef.meta?.onChange) {
                                      set(
                                        newData,
                                        `[${[row.index]}]`,
                                        await cell.column.columnDef.meta?.onChange(
                                          {
                                            row: {
                                              ...row,
                                              original: newData[row.index],
                                            },
                                            value,
                                          }
                                        )
                                      );
                                    } else {
                                      set(
                                        newData,
                                        // @ts-ignore
                                        `[${[row.index]}]${cell.column.columnDef.accessorKey}`,
                                        value
                                      );
                                    }
                                    // setData(newData);
                                    await table.options.meta?.updateRows?.({
                                      rows: [
                                        {
                                          ...row,
                                          original: newData[row.index],
                                        },
                                      ],
                                    });
                                  },
                                  onRevert: async (value) => {
                                    const newData = data;
                                    cell.row.columnFiltersMeta = {
                                      isChanged: (
                                        (cell.row.columnFiltersMeta.isChanged ||
                                          []) as string[]
                                      ).filter((item) => item !== cell.id),
                                    };
                                    if (cell.column.columnDef.meta?.onRevert) {
                                      // newData[virtualRow.index] = {
                                      //   ...newData[virtualRow.index],
                                      //   ...cell.column.columnDef.meta?.onRevert(
                                      //     newData[virtualRow.index],
                                      //     value,
                                      //   ),
                                      // };
                                      set(
                                        newData,
                                        `[${[row.index]}]`,
                                        await cell.column.columnDef.meta?.onRevert(
                                          {
                                            row: {
                                              ...row,
                                              original: newData[row.index],
                                            },
                                            value,
                                          }
                                        )
                                      );
                                    } else {
                                      set(
                                        newData,
                                        // @ts-ignore
                                        `[${[row.index]}]${cell.column.columnDef.accessorKey}`,
                                        value
                                      );
                                    }
                                    setData(newData);
                                    reRender();
                                  },
                                })}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )
            ) : (
              <TableCell colSpan={columns.length} className="p-2">
                <span>asd</span>
                {/*<Skeletons*/}
                {/*  rows={sortOptionState?.[0].limit || 50}*/}
                {/*  {...skeletons}*/}
                {/*/>*/}
              </TableCell>
            )}
          </TableBody>
        </Table>
      </section>
      {showFooter && (
        <footer className="relative">
          <PaginationActions
            isLoading={meta?.isLoading}
            totalRows={page?.totalRows ?? 0}
            page={page?.current ?? 1}
            rowsPerPage={page?.limit ?? LimitOptions['50']}
            onPageChange={handleChangePage}
            visiblePageCnt={visiblePageCnt}
          />
          {sortOptionState && showLimit && (
            <div className="absolute right-0 bottom-0">
              <Select
                onValueChange={(value) => {
                  if (sortOptionState[1]) {
                    sortOptionState[1]({
                      ...sortOptionState[0],
                      limit: Number(value),
                    });
                  }
                }}
                value={String(sortOptionState[0]?.limit || 'undefined')}
              >
                <SelectTrigger className="w-auto py-0">
                  <SelectValue placeholder="Page" prefix={'aa'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undefined">전체</SelectItem>
                  {/*{(Object.keys(t.limit) as [keyof typeof t.limit])?.map(*/}
                  {/*  (limit) => (*/}
                  {/*    <SelectItem*/}
                  {/*      key={`limit-${String(limit)}`}*/}
                  {/*      value={String(limit)}*/}
                  {/*    >*/}
                  {/*      {t.limit[limit]}*/}
                  {/*    </SelectItem>*/}
                  {/*  ),*/}
                  {/*)}*/}
                </SelectContent>
              </Select>
            </div>
          )}
        </footer>
      )}
    </React.Fragment>
  );
}

export const DataTable = DataTableInner;
// export const DataTable = React.forwardRef(DataTableInner);
// DataTable.displayName = "DataTable";
