import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';
import AppConstants from '../types/app-constants';
import { onError } from '@apollo/client/link/error';
import { createFragmentRegistry } from '@apollo/client/cache';
import { FRONTMATTER_FRAGMENT } from '../graphql/frontmatter';

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message));
});

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    connectToDevTools: process.env.NODE_ENV !== 'production',
    cache: new InMemoryCache({
      fragments: createFragmentRegistry(FRONTMATTER_FRAGMENT),
    }),
    link: ApolloLink.from([
      errorLink,
      new HttpLink({
        uri: AppConstants.API_HOST,
      }),
    ]),
  });
});
