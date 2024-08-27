import { useEffect, useState } from "react";
import { useSearchParams } from "./use-search-params";

export function useSortOptions(defaultFilterOptions: SortOptions): [
  SortOptions,
  (option: {
    [key in keyof SortOptions]: SortOptions[key]; //string; //SortOptionsDto[key];
  }) => void,
] {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortOptions, setSortOptions] = useState(defaultFilterOptions);

  useEffect(() => {
    let sortOrder: "asc" | "desc" = searchParams["sortOrder"] as "asc" | "desc";
    if (!["asc", "desc"].includes(sortOrder)) {
      sortOrder = defaultFilterOptions.sortOrder;
    }

    setSortOptions({
      sortKey: searchParams["sortKey"] ?? defaultFilterOptions.sortKey,
      sortOrder: sortOrder,
      page: parseInt(
        searchParams["page"] ?? String(defaultFilterOptions.page),
        10,
      ),
      limit: parseInt(
        searchParams["limit"] ?? String(defaultFilterOptions.limit),
        10,
      ),
    });
  }, [searchParams]);

  const _setSortOptions = (option: {
    [key in keyof SortOptions]: SortOptions[key]; //string; //SortOptionsDto[key];
  }) => {
    let newSearch: { [key: string]: string } = {
      ...searchParams,
      ...(option as { [key in keyof SortOptions]: any }),
    };
    setSearchParams(newSearch);
  };

  return [sortOptions, _setSortOptions];
}
