import { TypedDocumentNode } from '@apollo/client';
import { Project } from '../types/graphql';
import { gql } from 'graphql-tag';

export const GET_PROJECTS: TypedDocumentNode<{
  projects: QueryConnection<Project>;
}> = gql`
  query projects {
    projects {
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

export const GET_PROJECT: TypedDocumentNode<{
  project: Project;
}> = gql`
  query project($projectId: ID) {
    project(projectId: $projectId) {
      id
      frontmatter {
        ...Frontmatter
      }
      content
    }
  }
`;
