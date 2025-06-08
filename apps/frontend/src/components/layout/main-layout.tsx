'use client';

import React, { Suspense } from 'react';
import { cn } from '@my-codebase/lib/utils';
import Header from '../../components/layout/header';
import Footer from '../../components/layout/footer';
import { Loader } from '@my-codebase/ui/loader';

export default function MainLayout({
  className,
  children,
}: Readonly<{
  className?: string;
  children: React.ReactNode;
}>) {
  return (
    <React.Fragment>
      <Header />
      <div
        className={cn(
          'container mb-48',
          'flex max-w-[100vw] sm:max-w-3xl mx-auto min-h-full',
          className
        )}
      >
        <main className="grow max-w-full break-words">
          <Suspense fallback={<Loader className="w-full my-20" />}>
            {children}
          </Suspense>
        </main>
      </div>
      <Footer />
    </React.Fragment>
  );
}
