'use client';

import * as React from 'react';
import PostItemList from './post-item-list';
import { GET_POSTS } from '../../graphql/post';

export default function PostHome({ dict }: PageComponent) {
  return (
    <div className="my-12 px-2">
      <PostItemList query={GET_POSTS} queryName="posts" />
    </div>
  );
}
