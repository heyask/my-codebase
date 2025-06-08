import React, { useEffect, useState } from 'react';
import { CellContext } from '@tanstack/react-table';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../command';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Button } from '../button';
import { map } from 'lodash';

export function ComboboxCell<TData, TValue>({
  getValue,
  row,
  column,
  table,
  ...props
}: CellContext<TData, TValue>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);
  // const filteredOptions = propOptions;
  // const options = useMemo(() => {
  //   if (column.columnDef.meta?.groupBy === undefined)
  //     return { "": column.columnDef.meta?.getOptions?.() };
  //   return _.groupBy(
  //     column.columnDef.meta?.getOptions?.(),
  //     column.columnDef.meta?.groupBy,
  //   );
  // }, [column.columnDef.meta?.getOptions?.(), column.columnDef.meta?.groupBy]);

  useEffect(() => {
    if (!table.options.meta?.isRefetching) setValue(initialValue);
  }, [initialValue, table.options.meta?.isRefetching]);
  const [focused, setFocused] = useState(false);

  return (
    <Popover open={open} onOpenChange={(open) => setOpen(open)}>
      <PopoverTrigger
        asChild
        // onKeyDownCapture={onKeyDownCapture}
        // onKeyUp={onKeyUp}
        onKeyDown={async (e) => {
          switch (e.key) {
            // case "Enter":
            //   e.preventDefault();
            //   e.stopPropagation();
            //   // if (selectedOption && isChanged) {
            //   //   await propOnUpdate?.();
            //   // }
            //   return false;
            //   break;
            case 'Escape':
              setValue(initialValue);
              props?.onRevert?.(initialValue);
              break;
          }
        }}
      >
        <Button
          variant="outline"
          role="combobox"
          className="w-full bg-transparent"
          disabled={table.options.meta?.isLoading}
          style={
            value
              ? column.columnDef.meta?.getStyle?.({ row, value })
              : undefined
          }
        >
          <span className="grow text-start overflow-hidden text-ellipsis">
            {column.columnDef.meta?.getLabel?.({ row, value })}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command filter={column.columnDef.meta?.filterOptions}>
          <CommandInput
            placeholder="Search..."
            // onFocus={() => setFocused(true)}
            // onBlur={() => setFocused(false)}
          />
          {open && (
            <CommandList>
              <CommandEmpty>No result found.</CommandEmpty>
              {map(
                column.columnDef.meta?.getOptions?.(),
                (groupOptions, group) => {
                  const optionComponents = map(groupOptions, (option) => {
                    const isSelected =
                      column.columnDef.meta?.getOptionValue?.({
                        row,
                        value: option,
                      }) ===
                      column.columnDef.meta?.getOptionValue?.({
                        row,
                        value,
                      });
                    return (
                      <CommandItem
                        key={column.columnDef.meta?.getOptionValue?.({
                          row,
                          value: option,
                        })}
                        keywords={column.columnDef.meta?.getKeywords?.({
                          row,
                          value: option,
                        })}
                        disabled={isSelected}
                        value={column.columnDef.meta?.getOptionValue?.({
                          row,
                          value: option,
                        })}
                        className="border border-transparent data-[selected=true]:border-primary rounded-none cursor-pointer"
                        style={
                          option
                            ? column.columnDef.meta?.getStyle?.({
                                row,
                                value: option,
                              })
                            : undefined
                        }
                        onSelect={async (_) => {
                          const _option = groupOptions.find(
                            (propsOption) =>
                              column.columnDef.meta?.getOptionValue?.({
                                row,
                                value: option,
                              }) ===
                              column.columnDef.meta?.getOptionValue?.({
                                row,
                                value: propsOption,
                              })
                          );
                          setValue(_option as TValue);
                          // props?.onChange?.(_option, true);
                          await props?.onUpdate?.(_option);
                          setOpen(false);
                        }}
                      >
                        {column.columnDef.meta?.getLabel?.({
                          row,
                          value: option,
                        })}
                        {isSelected && (
                          <CheckIcon className="ml-2" width="20" height="20" />
                        )}
                      </CommandItem>
                    );
                  });
                  return group ? (
                    <CommandGroup heading={group} key={`${group}`}>
                      {optionComponents}
                    </CommandGroup>
                  ) : (
                    optionComponents
                  );
                }
              )}
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
