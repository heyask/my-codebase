export const LimitOptions = {
  10: 10,
  25: 25,
  50: 50,
  100: 100,
  250: 250,
  500: 500,
  1000: 1000,
  total: 9999,
} as const;
export type LimitOptions = (typeof LimitOptions)[keyof typeof LimitOptions];

export interface IPage {
  totalRows: number;
  total: number;
  current: number;
  limit: number | LimitOptions;
}

type SortOrder = 'asc' | 'desc';

export type SortOptions = {
  sortKey: string;
  sortOrder: SortOrder;
  page: number;
  limit: number;
};

export type FilterOptions = {
  keyword?: string;
  userId?: number;
  fromDate?: Date;
  toDate?: Date;
  status?: string | number;
  type?: string | number;
  category?: string;
  countryCode?: string;
  currencyCode?: string;
};

export const Theme = {
  light: 'light',
  dark: 'dark',
  system: 'system',
} as const;
export type Theme = (typeof Theme)[keyof typeof Theme];

export const Lang = {
  en: 'en',
  ko: 'ko',
  system: 'system',
} as const;
export type Lang = (typeof Lang)[keyof typeof Lang];
