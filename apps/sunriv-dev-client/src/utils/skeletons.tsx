import React, { forwardRef, useMemo } from 'react';
import { cn } from '@my-workspace/lib/utils';
import { Skeleton } from '@my-workspace/ui/skeleton';
import { Separator } from '@my-workspace/ui/separator';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  type: 'post' | 'project' | 'comment';
};
const Skeletons = forwardRef<HTMLDivElement, Props>(
  ({ type, className, ...props }, ref) => {
    const arr = useMemo(
      () => Array.from({ length: type === 'post' ? 10 : 10 }),
      []
    );

    return (
      <div className={cn('', className)}>
        {arr.map((_, i) => (
          <React.Fragment key={`skeleton_${i}`}>
            {type === 'post' ? (
              <React.Fragment>
                <div className="w-full flex items-center gap-4 px-1 my-2">
                  <div className="grow flex flex-col gap-2 p-5">
                    <Skeleton className="h-4 w-2/5 rounded-lg" />
                    <Skeleton className="h-8 my-2 rounded-lg" />
                    <Skeleton className="h-3 rounded-lg" />
                    <Skeleton className="h-3 rounded-lg" />
                    <Skeleton className="h-3 rounded-lg" />
                    <Skeleton className="h-4 w-1/5 my-2 rounded-lg" />
                  </div>
                </div>
                <Separator />
              </React.Fragment>
            ) : type === 'project' ? (
              <React.Fragment>
                <div className="w-full flex items-center gap-4 px-1 my-2">
                  <div className="grow flex flex-col gap-2 p-5">
                    <Skeleton className="h-4 w-2/5 rounded-lg" />
                    <Skeleton className="h-8 my-2 rounded-lg" />
                    <Skeleton className="h-3 rounded-lg" />
                    <Skeleton className="h-3 rounded-lg" />
                    <Skeleton className="h-3 rounded-lg" />
                    <Skeleton className="h-4 w-1/5 my-2 rounded-lg" />
                  </div>
                </div>
                <Separator />
              </React.Fragment>
            ) : type === 'comment' ? (
              <div className="w-full flex items-start gap-2 mb-2">
                <div>
                  <Skeleton className="flex rounded-full w-8 h-8" />
                </div>
                <div className="w-full flex flex-col gap-2 mt-1.5">
                  <Skeleton className="h-3 w-1/5 rounded-lg" />
                  <Skeleton className="h-5 rounded-lg mt-0.5" />
                  <Skeleton className="h-5 w-2/5 rounded-xl mt-1" />
                </div>
              </div>
            ) : (
              <div />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }
);

Skeletons.displayName = 'Skeletons';

export default Skeletons;
