'use client';

import React, { Suspense } from 'react';
import { cn } from '@my-codebase/lib/utils';
import { Loader } from '@my-codebase/ui/loader';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  sidebarContent?: React.ReactNode;
  showAd?: boolean;
};
const ContentLayout = React.forwardRef<HTMLDivElement, Props>(
  ({ sidebarContent, showAd, className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex gap-0 sm:gap-4')}>
        <article className={cn('grow flex flex-col items-stretch', className)}>
          <Suspense fallback={<Loader className="w-full my-20" />}>
            {children}
          </Suspense>
        </article>
      </div>
    );
  }
);

ContentLayout.displayName = 'ContentLayout';

export default ContentLayout;
