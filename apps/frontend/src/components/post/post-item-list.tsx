'use client';

import * as React from 'react';
import { Suspense, useRef } from 'react';
import dayjs from 'dayjs';
import { urlSafeString } from '@my-workspace/lib/utils';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { Skeletons } from '@my-workspace/ui/skeleton';
import Link from 'next/link';
import { Badge } from '@my-workspace/ui/badge';
import { Icon } from '@my-workspace/ui/icon';

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  queryName: string;
  refetch?: any;
  fetchMore?: any;
  isLoading?: boolean;
  className?: string;
  flags?: {
    fromRecent?: boolean;
  };
  query: any;
  variables?: any;
};
const PostItemList = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <Suspense fallback={<Skeletons className="w-full" />}>
      <_postItemList ref={ref} {...props} />
    </Suspense>
  );
});

PostItemList.displayName = 'PostItemList';

export default PostItemList;

const _postItemList = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { query, queryName, variables, isLoading, className, flags } = props;
  const { data, fetchMore, refetch } = useSuspenseQuery(query, {
    variables,
  });
  const loadingSpinnerRef = useRef(null);

  // useEffect(() => {
  //   let localRef = loadingSpinnerRef.current;
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry && entry.isIntersecting) {
  //         startTransition(() => {
  //           fetchMore?.({
  //             // update `after` variable with `endCursor` from previous result
  //             variables: {
  //               // @ts-ignore
  //               after: data?.[queryName]?.pageInfo?.endCursor,
  //             },
  //
  //             // pass previous query result and the new results to `updateQuery`
  //             updateQuery: (
  //               previousQueryResult: any,
  //               { fetchMoreResult }: any
  //             ) => {
  //               // define edges and pageInfo from new results
  //               const newEdges = fetchMoreResult[queryName].edges;
  //               const newPageInfo = fetchMoreResult[queryName].pageInfo;
  //
  //               let result = { ...previousQueryResult };
  //               // if newEdges actually have items,
  //               if (newEdges.length) {
  //                 // return a reconstruction of the query result with updated values
  //                 result[queryName] = {
  //                   // spread the value of the previous `allStarhips` data into this object
  //                   ...previousQueryResult[queryName],
  //                   // concatenate edges
  //                   edges: [
  //                     ...previousQueryResult[queryName].edges,
  //                     ...newEdges,
  //                   ],
  //                   // override with new pageInfo
  //                   pageInfo: newPageInfo,
  //                 };
  //               } else {
  //                 // else, return the previous result
  //                 result = previousQueryResult;
  //               }
  //
  //               return result;
  //             },
  //           });
  //         });
  //       }
  //     },
  //     { threshold: 1 }
  //   );
  //   if (localRef) observer.observe(localRef);
  //   return () => {
  //     if (localRef) observer.unobserve(localRef);
  //   };
  // }, [loadingSpinnerRef, data, queryName, fetchMore]);

  return (
    <div className="flex flex-col gap-4">
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-expect-error */}
      {data?.[queryName]?.edges?.map((post, idx) => {
        return (
          <Link
            color="foreground"
            key={post.node?.id}
            href={`/posts/${post.node?.id}/${urlSafeString(
              post.node.frontmatter?.title
            )}`}
            className="group hover:bg-accent/50 active:bg-accent rounded-lg transition-colors"
          >
            <article
              itemScope
              itemType="https://schema.org/Article"
              className="w-full flex gap-4 p-2 sm:p-4"
            >
              <div className="grow">
                <header>
                  <div className="flex gap-4 items-center border-l-4 pl-2 leading-tight">
                    <div>
                      {dayjs(post.node.frontmatter?.createdAt).format(
                        'MMMM DD, YYYY'
                      )}
                    </div>
                    <Badge variant="secondary">
                      {post.node.frontmatter?.category}
                    </Badge>
                  </div>
                  <h2 className="font-bold text-xl my-3 group-hover:underline">
                    {post.node.frontmatter?.title}
                  </h2>
                </header>
                <section
                  className="text-sm line-clamp-3 min-h-16 my-2"
                  dangerouslySetInnerHTML={{
                    __html: post.node.frontmatter?.description || '',
                  }}
                  itemProp="description"
                />
                <div className="text-sky-600 text-sm flex gap-1 items-center">
                  Read post <Icon icon="mdi:greater-than" width={10} />
                </div>
              </div>
              {/*{post.node.frontmatter?.thumbnail && (*/}
              {/*  <div className="w-28 min-w-28 max-w-28 hidden sm:block">*/}
              {/*    <Image src={post.node.frontmatter?.thumbnail} alt={''} />*/}
              {/*  </div>*/}
              {/*)}*/}
            </article>
          </Link>
        );
      })}
    </div>
  );
});
_postItemList.displayName = '_postItemList';
