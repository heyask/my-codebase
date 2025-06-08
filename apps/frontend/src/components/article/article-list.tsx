'use client';
import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Translation } from 'core/i18n';
import { useFilterOptions } from 'core/hooks/use-filter-options';
import { useSortOptions } from 'core/hooks/use-sort-options';
import { articleApi } from 'core/apis/article.api';
import { ArticleType, IArticle } from 'core-types/interfaces';
import { processTableJob } from 'core/lib/utils';
import dayjs from 'dayjs';
import { DataTable } from 'core/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import {
  RowSelectionCell,
  RowSelectionHeaderCell,
} from 'core/components/ui/data-table/row-selection-cell';
import {
  ActionsCell,
  ActionsHeaderCell,
} from 'core/components/ui/data-table/actions-cell';
import Image from 'next/image';
import { AppConfig } from 'core/utils/app-config';
import { IdCell } from 'core/components/ui/data-table/id-cell';
import { useToast } from 'core/components/ui/use-toast';

/**
 * 참고용 타 프로젝트의 리스트 페이지 코드입니다.
 */
type Props = { t: Translation };
export default function ArticleList({ t }: Props) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [filterOptions, setFilterOptions, resetFilterOptions] =
    useFilterOptions({});
  const [sortOptions, setSortOptions] = useSortOptions({
    sortKey: 'id',
    sortOrder: 'desc',
    page: 1,
    limit: 50,
  });
  const {
    data: articlesData,
    refetch: refetchArticles,
    isFetching: isFetchingArticles,
  } = useQuery({
    queryKey: ['articles', {}, filterOptions, sortOptions],
    queryFn: articleApi.common.getArticles,
  });
  const { mutateAsync: createArticleMutateAsync } = useMutation({
    mutationFn: articleApi.admin.createArticle,
  });
  const { mutateAsync: deleteArticlesMutateAsync } = useMutation({
    mutationFn: articleApi.admin.deleteArticles,
  });

  const columns = React.useMemo<ColumnDef<IArticle, any>[]>(
    () => [
      {
        id: 'select',
        header: RowSelectionHeaderCell,
        cell: RowSelectionCell,
        size: 30,
      },
      {
        id: 'actions',
        header: ActionsHeaderCell,
        cell: ActionsCell,
        size: 30,
      },
      {
        id: 'articles',
        accessorKey: 'id',
        header: 'ID',
        size: 60,
        cell: IdCell,
      },
      {
        accessorKey: 'articleType',
        header: '유형',
        size: 60,
        cell: ({ getValue }) => t.articleType[getValue()],
      } as ColumnDef<IArticle, IArticle['articleType']>,
      {
        accessorKey: 'createdAt',
        header: '날짜',
        size: 150,
        cell: ({ getValue }) =>
          dayjs(getValue<string>()).format('MM/DD/YY HH:mm:ss'),
      },
      {
        accessorKey: 'thumbnails',
        header: '썸네일',
        size: 50,
        cell: ({ row, getValue }) => {
          return (
            <div className="flex flex-col h-full">
              <Image
                unoptimized
                width={100}
                height={100}
                alt=""
                src={`${AppConfig.FILE_HOST}/uploads/${getValue()}`}
              />
            </div>
          );
        },
      },
      {
        accessorKey: 'title',
        header: '제목',
        size: 300,
      },
      {
        accessorKey: 'url',
        header: 'URL',
        size: 300,
        cell: ({ getValue }) => {
          return getValue() ? (
            <a
              href={getValue()}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              {getValue()}
            </a>
          ) : (
            <div />
          );
        },
      },
    ],
    [articlesData]
  );

  return (
    <div className="content-container no-scroll">
      <DataTable
        t={t}
        data={articlesData?.articles}
        page={articlesData?.page}
        sortOptionState={[sortOptions, setSortOptions]}
        meta={{
          isLoading: isLoading || isFetchingArticles,
          createRow: async ({ row }) =>
            processTableJob(
              async () => {
                await createArticleMutateAsync({
                  article: row
                    ? row.original
                    : {
                        articleType: ArticleType.Blog,
                        title: '',
                        url: '',
                        content: '',
                        description: '',
                        category: '',
                        thumbnails: [],
                        // @ts-ignore
                        createdAt: undefined,
                        // @ts-ignore
                        updatedAt: undefined,
                      },
                });
              },
              toast,
              setIsLoading,
              refetchArticles
            ),
          deleteRows: async ({ rows }) =>
            processTableJob(
              async () => {
                await deleteArticlesMutateAsync({
                  articles: rows.map((row) => row.original),
                });
              },
              toast,
              setIsLoading,
              refetchArticles
            ),
        }}
        columns={columns}
      />
    </div>
  );
}
