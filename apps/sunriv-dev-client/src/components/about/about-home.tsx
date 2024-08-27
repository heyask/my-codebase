'use client';

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import * as React from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { AboutType } from '../../types/interfaces';
import dayjs from 'dayjs';
import { cn } from '@my-workspace/lib/utils';
import { upperCase } from 'lodash-es';
import { GET_ABOUT } from '../../graphql/about';
import Link from 'next/link';
import { Lang } from '@my-workspace/lib/types';

export default function AboutHome({ dict }: PageComponent) {
  const [aboutType, setAboutType] = React.useState<AboutType>(AboutType.cv);
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const {
    data: { about },
  } = useSuspenseQuery(GET_ABOUT, {
    variables: {
      aboutId:
        aboutType === AboutType.resume
          ? params.lang === Lang.en
            ? '22'
            : '21'
          : params.lang === Lang.en
            ? '20'
            : '19',
    },
  });

  return (
    <div className="px-6">
      <article itemScope itemType="https://schema.org/Article">
        <div className="print:hidden text-sm text-right mt-8">
          <div className="italic">
            Updated at{' '}
            {dayjs(about.frontmatter?.updatedAt).format('MMMM DD, YYYY')}
          </div>
          <div className="flex gap-1.5 justify-end my-2">
            <span
              className="underline cursor-pointer"
              onClick={(e) => {
                setAboutType((prev) =>
                  prev === AboutType.cv ? AboutType.resume : AboutType.cv
                );
              }}
            >
              {aboutType === AboutType.resume ? 'RESUME' : 'CV'}
            </span>
            {['ko', 'en'].map((l) => (
              <Link
                key={l}
                href={`/${l}/about`}
                className={cn('underline', {
                  'font-bold text-primary': params.lang === l,
                })}
              >
                {upperCase(l)}
              </Link>
            ))}
          </div>
        </div>
        <section
          className="post-content about-content"
          dangerouslySetInnerHTML={{ __html: about.content || '' }}
        />
      </article>
    </div>
  );
}
