import { TypedDocumentNode } from '@apollo/client';
import { About } from '../types/graphql';
import { gql } from 'graphql-tag';

export const GET_ABOUT: TypedDocumentNode<{
  about: About;
}> = gql`
  query about($aboutId: ID) {
    about(aboutId: $aboutId) {
      id
      frontmatter {
        ...Frontmatter
      }
      content
    }
  }
`;
