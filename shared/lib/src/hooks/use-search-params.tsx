import {
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from 'next/navigation';
import { useMemo } from 'react';
import { filter, omitBy } from 'lodash';

type SearchParams = { [key: string]: string | number | symbol | undefined };
export function useSearchParams(): [
  { [p: string]: string },
  (option: SearchParams) => void
] {
  const pathname = usePathname();
  const router = useRouter();
  const nextSearchParams = useNextSearchParams();

  let searchParams = useMemo(
    () => Object.fromEntries(nextSearchParams?.entries() ?? []),
    [nextSearchParams]
  );

  const setSearchParams = (newSearchParams: SearchParams) => {
    const filtered = omitBy(
      newSearchParams,
      (value) => typeof value === 'undefined' || value === ''
    ) as { [key: string]: string };
    router.push(`${pathname}?${new URLSearchParams(filtered).toString()}`);
  };

  return [searchParams, setSearchParams];
}
