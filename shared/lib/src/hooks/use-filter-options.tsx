import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { currencyState } from '../stores/currency';
import { useRecoilState } from 'recoil';
import { countryState } from '../stores/country';
import { useSearchParams } from './use-search-params';
import { AppConstants } from 'core-types/constants';

export function useFilterOptions(defaultFilterOptions: FilterOptions): [
  FilterOptions,
  (option: {
    [key in keyof FilterOptions]: FilterOptions[key];
  }) => void,
  () => void
] {
  const [currency, setCurrency] = useRecoilState(currencyState);
  const [country, setCountry] = useRecoilState(countryState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOptions, setFilterOptions] = useState({
    countryCode: country.code ?? AppConstants.COUNTRY.IA.code,
    currencyCode: currency.code ?? AppConstants.CURRENCY.KRW.code,
    ...defaultFilterOptions,
  });

  // SearchParams가 바뀔때
  useEffect(() => {
    const keyword = searchParams['keyword'] ?? defaultFilterOptions.keyword;
    const userId = searchParams['userId'] ?? defaultFilterOptions.userId;
    const fromDate = searchParams['fromDate'] ?? defaultFilterOptions.fromDate;
    const toDate = searchParams['toDate'] ?? defaultFilterOptions.toDate;
    const status = searchParams['status'] ?? defaultFilterOptions.status;
    const type = searchParams['type'] ?? defaultFilterOptions.type;
    const category = searchParams['category'] ?? defaultFilterOptions.category;

    setFilterOptions({
      ...(keyword !== undefined ? { keyword } : {}),
      ...(userId !== undefined
        ? {
            userId: Number(userId),
          }
        : {}),
      ...(fromDate !== undefined ? { fromDate: dayjs(fromDate).toDate() } : {}),
      ...(toDate !== undefined ? { toDate: dayjs(toDate).toDate() } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(type !== undefined ? { type } : {}),
      ...(category !== undefined ? { category } : {}),
      countryCode: country.code ?? AppConstants.DEFAULT_COUNTRY_CODE,
      currencyCode: currency.code ?? AppConstants.DEFAULT_CURRENCY_CODE,
    });
  }, [searchParams, country, currency]);

  useEffect(() => {}, [filterOptions]);

  const _setFilterOptions = (option: {
    [key in keyof FilterOptions]: FilterOptions[key];
  }) => {
    const keyword = option.keyword ?? defaultFilterOptions.keyword;
    const userId = option.userId ?? defaultFilterOptions.userId;
    const fromDate = option.fromDate ?? defaultFilterOptions.fromDate;
    const toDate = option.toDate ?? defaultFilterOptions.toDate;
    const status = option.status ?? defaultFilterOptions.status;
    const type = option.type ?? defaultFilterOptions.type;
    const category = option.category ?? defaultFilterOptions.category;

    let newSearch: { [key: string]: string } = {
      ...(keyword !== undefined ? { keyword: String(keyword) } : {}),
      ...(userId !== undefined ? { userId: String(userId) } : {}),
      ...(fromDate !== undefined
        ? { fromDate: dayjs(fromDate).format('YYYY-MM-DD') }
        : {}),
      ...(toDate !== undefined
        ? { toDate: dayjs(toDate).format('YYYY-MM-DD') }
        : {}),
      ...(status !== undefined ? { status: String(status) } : {}),
      ...(type !== undefined ? { type: String(type) } : {}),
      ...(category !== undefined ? { category: String(category) } : {}),
    };
    setSearchParams(newSearch);
  };

  const resetFilterOptions = () => {
    _setFilterOptions(defaultFilterOptions);
  };

  return [filterOptions, _setFilterOptions, resetFilterOptions];
}
