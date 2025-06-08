'use client';

import { ApolloLink } from '@apollo/client';
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { PropsWithChildren, useCallback } from 'react';
import AppConstants from '../types/app-constants';
import { createFragmentRegistry } from '@apollo/client/cache';
import { FRONTMATTER_FRAGMENT } from '../graphql/frontmatter';
import { onError } from '@apollo/client/link/error';

if (AppConstants.DEPLOY_ENV !== 'production') {
  // setVerbosity('debug');
}

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message));
});

function createClient(accessToken?: string) {
  const uploadLink = createUploadLink({
    // uri:
    //   typeof window !== 'undefined' && process.env.NODE_ENV !== 'production'
    //     ? AppConfig.API_HOST
    //     : `http://host.docker.internal:${process.env.SERVER_PORT}/api/graphql`,
    uri: AppConstants.API_HOST,
    headers: {
      ...(accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {}),
      'Apollo-Require-Preflight': 'true',
    },
  });

  return new NextSSRApolloClient({
    connectToDevTools: process.env.NODE_ENV !== 'production',
    cache: new NextSSRInMemoryCache({
      fragments: createFragmentRegistry(FRONTMATTER_FRAGMENT),
    }),
    link: ApolloLink.from([
      ...(typeof window === 'undefined'
        ? [
            new SSRMultipartLink({
              stripDefer: true,
            }),
          ]
        : []),
      errorLink,
      uploadLink,
    ]),
  });
}

export function ApolloWrapper({
  accessToken,
  children,
}: PropsWithChildren<{
  accessToken?: string;
}>) {
  const makeClient = useCallback(
    () => createClient(accessToken),
    [accessToken]
  );
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
