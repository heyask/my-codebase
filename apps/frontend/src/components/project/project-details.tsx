'use client';

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import * as React from 'react';
import { useParams } from 'next/navigation';
import 'highlight.js/styles/github-dark-dimmed.min.css';
import { GET_PROJECT } from '../../graphql/project';
import dayjs from 'dayjs';
import { Button } from '@my-workspace/ui/button';
import Link from 'next/link';
import { Badge } from '@my-workspace/ui/badge';

export default function ProjectDetails({ dict }: PageComponent) {
  const params = useParams();
  const {
    data: { project },
  } = useSuspenseQuery(GET_PROJECT, {
    variables: {
      projectId: params.id,
    },
  });

  return (
    <div className="my-12 px-4">
      <article itemScope itemType="https://schema.org/Article">
        <header className="my-4">
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-snug py-2">
            {project.frontmatter?.title}
          </h1>
          <div className="flex gap-2 items-center mt-2">
            <span className="text-sm">
              {dayjs(project.frontmatter?.startAt).format('MMMM, YYYY')} ~{' '}
              {project.frontmatter?.endAt
                ? dayjs(project.frontmatter?.endAt).format('MMMM, YYYY')
                : 'Current'}
            </span>
            {project.frontmatter?.company && (
              <Badge variant="secondary">{project.frontmatter?.company}</Badge>
            )}
            {project.frontmatter?.url && (
              <Button
                asChild
                color="primary"
                // showAnchorIcon
                // variant="solid"
              >
                <Link href={project.frontmatter?.url}>DEMO</Link>
              </Button>
            )}
          </div>
        </header>
        <div>
          <section
            className="post-content about-content"
            dangerouslySetInnerHTML={{ __html: project.content || '' }}
            itemProp="articleBody"
          />
        </div>
      </article>
      <div className="text-center my-24">
        <Link href={`/${params.lang}/projects`}>{dict.toList}</Link>
      </div>
    </div>
  );
}
