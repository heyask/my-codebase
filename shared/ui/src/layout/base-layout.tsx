'use client';

import React from 'react';
import { useRecoilValue } from 'recoil';
import { themeState } from '@my-workspace/lib/stores/theme';
import { cn } from '@my-workspace/lib/utils';

export default function BaseLayout({
  className,
  children,
}: Readonly<{
  className?: string;
  children: React.ReactNode;
}>) {
  const theme = useRecoilValue(themeState);

  return (
    <html
      lang="en"
      className={cn('text-foreground bg-background', theme.selector, className)}
    >
      <body className={cn('max-w-[100vw] overflow-x-hidden', {})}>
        {children}
      </body>
    </html>
  );
}
