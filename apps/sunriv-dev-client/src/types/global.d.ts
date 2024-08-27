import { Dictionary } from '@/app/[lang]/dictionaries';

declare module '*.jpg';

declare global {
  type PageInfo = {
    hasNextPage: boolean;
    endCursor: string;
  };
  type Edge<T> = {
    cursor: string;
    node: T;
  };
  type QueryConnection<T> = {
    pageInfo: PageInfo;
    edges: Edge<T>[];
  };

  type Locale = 'en' | 'ko';
  type PageProps = { params: { lang: Locale } };
  type PageComponent = { dict: Dictionary };
}
