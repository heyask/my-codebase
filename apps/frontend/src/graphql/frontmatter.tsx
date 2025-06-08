import { gql } from 'graphql-tag';

export const FRONTMATTER_FRAGMENT = gql`
  fragment Frontmatter on Frontmatter {
    id
    title
    category
    company
    description
    url
    thumbnail
    createdAt
    updatedAt
    startAt
    endAt
  }
`;
