'use client';

import * as React from 'react';
import { Suspense, useMemo, useRef } from 'react';
import dayjs from 'dayjs';
import { urlSafeString } from '@my-codebase/lib/utils';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_PROJECTS } from '../../graphql/project';
import { groupBy } from 'lodash-es';
import { cn } from '@my-codebase/lib/utils';
import { useRouter } from 'next/navigation';
import { Badge } from '@my-codebase/ui/badge';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@my-codebase/ui/card';
import { Skeletons } from '@my-codebase/ui/skeleton';

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  queryName: string;
  refetch?: any;
  fetchMore?: any;
  isLoading?: boolean;
  className?: string;
  flags?: {
    fromRecent?: boolean;
    listView?: boolean;
  };
  query: any;
  variables?: any;
};
const ProjectItemList = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    return (
      <Suspense fallback={<Skeletons className="w-full" />}>
        <_projectItemList ref={ref} {...props} />
      </Suspense>
    );
  }
);

ProjectItemList.displayName = 'ProjectItemList';

export default ProjectItemList;

const _projectItemList = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const { data, refetch } = useSuspenseQuery(GET_PROJECTS);
    const router = useRouter();
    const projects = useMemo(() => {
      if (!data) return {};

      const result = groupBy(data.projects?.edges, 'node.frontmatter.category');
      const entries = Object.entries({
        'Work Experiences': result['Work Experiences'],
        'Startup Experiences': result['Startup Experiences'],
        'Other Projects': result['Other Projects'],
        'Personal Projects': result['Personal Projects'],
        'Community & Open Sources Activities':
          result['Community & Open Sources Activities'],
      });
      const sortedObj = Object.fromEntries(entries);

      return sortedObj;
    }, [data]);
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
      <>
        {Object.entries(projects).map(([key, projects]) => (
          <div key={`projgr-${key}`} className="my-12">
            <h2 className="text-primary text-3xl font-bold mt-8">{key}</h2>
            <div
              className={cn('grid grid-cols-1 sm:grid-cols-2 gap-6', {
                'sm:grid-cols-1': props.flags?.listView,
                'pt-8': !props.flags?.listView,
              })}
            >
              {projects?.map((project) => {
                return props.flags?.listView ? (
                  <article
                    key={`proj-${project.cursor}`}
                    itemScope
                    itemType="https://schema.org/Article"
                    className="post-content about-content"
                  >
                    <header className="my-4">
                      <h3>{project.node.frontmatter?.title}</h3>
                      <div className="flex gap-2 items-center">
                        <span className="text-sm">
                          {dayjs(project.node.frontmatter?.startAt).format(
                            'MMMM, YYYY'
                          )}{' '}
                          ~{' '}
                          {project.node.frontmatter?.endAt
                            ? dayjs(project.node.frontmatter?.endAt).format(
                                'MMMM, YYYY'
                              )
                            : 'Current'}
                        </span>
                        {project.node.frontmatter?.company && (
                          <Badge variant="secondary">
                            {project.node.frontmatter?.company}
                          </Badge>
                        )}
                        {project.node.frontmatter?.url && (
                          <Link
                            href={project.node.frontmatter?.url}
                            color="primary"
                            // showAnchorIcon
                          >
                            DEMO
                          </Link>
                        )}
                      </div>
                    </header>
                    <div>
                      <section
                        dangerouslySetInnerHTML={{
                          __html: project.node.content || '',
                        }}
                        itemProp="articleBody"
                      />
                    </div>
                  </article>
                ) : (
                  <Link
                    key={`proj-${project.cursor}`}
                    href={`/projects/${
                      project.node.frontmatter?.id
                    }/${urlSafeString(project.node.frontmatter?.title)}`}
                    className="group"
                  >
                    <Card
                      key={project.node.frontmatter?.id}
                      className="group-hover:bg-accent/50 transition-colors"
                      // isPressable
                      // onClick={() => {
                      //   router.push(
                      //     `/projects/${project.node.frontmatter?.id}/${urlSafeString(project.node.frontmatter?.title)}`
                      //   );
                      // }}
                      // classNames={{
                      //   base: 'group hover:bg-default-50',
                      //   body: 'p-6',
                      //   footer:
                      //     'px-6 pb-6 font-semibold text-default-500 group-hover:text-primary',
                      // }}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {project.node.frontmatter?.title}
                        </CardTitle>
                        <CardDescription className="flex gap-2">
                          {dayjs(project.node.frontmatter?.startAt).format(
                            'MMMM, YYYY'
                          )}
                          {project.node.frontmatter?.company && (
                            <Badge variant="secondary">
                              {project.node.frontmatter?.company}
                            </Badge>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{project.node.frontmatter?.description}</p>
                      </CardContent>
                      <CardFooter>
                        {project.node.frontmatter?.url && (
                          <Link
                            href={project.node.frontmatter?.url}
                            target={
                              project.node.frontmatter?.url.startsWith('http')
                                ? '_blank'
                                : '_self'
                            }
                          >
                            Demo
                          </Link>
                        )}
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </>
    );
  }
);
_projectItemList.displayName = '_postItemList';
