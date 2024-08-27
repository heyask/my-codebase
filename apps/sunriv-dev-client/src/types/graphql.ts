// @ts-nocheck

/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class Frontmatter {
    __typename?: 'Frontmatter';
    id?: Nullable<string>;
    title?: Nullable<string>;
    description?: Nullable<string>;
    category?: Nullable<string>;
    company?: Nullable<string>;
    thumbnail?: Nullable<string>;
    lang?: Nullable<string>;
    url?: Nullable<string>;
    published?: Nullable<boolean>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    startAt?: Nullable<DateTime>;
    endAt?: Nullable<DateTime>;
}

export class PageInfo {
    __typename?: 'PageInfo';
    hasNextPage: boolean;
    endCursor?: Nullable<string>;
}

export class PostEdge {
    __typename?: 'PostEdge';
    cursor: string;
    node: Post;
}

export class PostConnection {
    __typename?: 'PostConnection';
    pageInfo: PageInfo;
    edges: PostEdge[];
}

export class Post {
    __typename?: 'Post';
    id?: Nullable<string>;
    frontmatter?: Nullable<Frontmatter>;
    content?: Nullable<string>;
}

export class ProjectEdge {
    __typename?: 'ProjectEdge';
    cursor: string;
    node: Project;
}

export class ProjectConnection {
    __typename?: 'ProjectConnection';
    pageInfo: PageInfo;
    edges: ProjectEdge[];
}

export class Project {
    __typename?: 'Project';
    id?: Nullable<string>;
    frontmatter?: Nullable<Frontmatter>;
    content?: Nullable<string>;
}

export class About {
    __typename?: 'About';
    id?: Nullable<string>;
    frontmatter?: Nullable<Frontmatter>;
    content?: Nullable<string>;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract posts(): Nullable<PostConnection> | Promise<Nullable<PostConnection>>;

    abstract post(postId?: Nullable<string>): Nullable<Post> | Promise<Nullable<Post>>;

    abstract projects(): Nullable<ProjectConnection> | Promise<Nullable<ProjectConnection>>;

    abstract project(projectId?: Nullable<string>): Nullable<Project> | Promise<Nullable<Project>>;

    abstract about(aboutId?: Nullable<string>): Nullable<About> | Promise<Nullable<About>>;
}

export type DateTime = any;
type Nullable<T> = T | null;
