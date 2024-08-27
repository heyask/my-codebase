import { cn } from '@my-workspace/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}


export const SkeletonsType = {
  default: 0,
  withThumbnail: 1,
} as const;
export type SkeletonsType = (typeof SkeletonsType)[keyof typeof SkeletonsType];

export type SkeletonsProps = {
  type?: SkeletonsType;
  rows?: number;
  // size?: 20 | 28 | 44 | 60 | 100 | 132 | 200;
  // gap?: number;
};
const Skeletons = ({
                            className,
                            type,
                            rows = 20,
                            ...props
                          }: SkeletonsProps & React.HTMLAttributes<HTMLDivElement>) => {
  return Array.from({ length: rows ?? 1 }).map((_, i) => (
    <Skeleton
      key={`skel-${i}`}
      className={cn({ "w-full h-7 mb-3 mt-1": !className }, className)}
    />
  ));
};

export { Skeleton, Skeletons };
