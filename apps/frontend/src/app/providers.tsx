'use client';

import { ApolloWrapper } from '../utils/apollo-wrapper';
import BaseLayout from '@my-codebase/ui/layout/base-layout';
import { Providers2 } from './providers2';
import BaseFunctionality from '../components/layout/base-functionality';

export function Providers({
  accessToken,
  themeCookie,
  localeCookie,
  ip,
  className,
  children,
}: {
  accessToken?: string;
  themeCookie?: string;
  localeCookie?: string;
  ip?: string | null;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <ApolloWrapper accessToken={accessToken}>
      <Providers2 themeCookie={themeCookie} localeCookie={localeCookie} ip={ip}>
        <BaseLayout className={className}>
          <BaseFunctionality>{children}</BaseFunctionality>
        </BaseLayout>
      </Providers2>
    </ApolloWrapper>
  );
}
