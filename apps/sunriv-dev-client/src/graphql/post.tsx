import { TypedDocumentNode } from '@apollo/client';
import { Post } from '../types/graphql';
import { gql } from 'graphql-tag';

export const GET_POSTS: TypedDocumentNode<{
  posts: QueryConnection<Post>;
}> = gql`
  query posts {
    posts {
      edges {
        node {
          id
          frontmatter {
            ...Frontmatter
          }
          content
        }
      }
    }
  }
`;

export const GET_POST: TypedDocumentNode<{
  post: Post;
}> = gql`
  query post($postId: ID) {
    post(postId: $postId) {
      id
      frontmatter {
        ...Frontmatter
      }
      content
    }
  }
`;
