import * as React from 'react';
import PostDetails from '../../../../../components/post/post-details';
import { getDictionary } from '../../../dictionaries';
import { Metadata, ResolvingMetadata } from 'next';
import { getClient } from '../../../../../utils/apollo-client';
import { GET_POST } from '../../../../../graphql/post';
import AppConstants from '../../../../../types/app-constants';
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string; title: string };
  searchParams: { [key: string]: string | string[] | undefined };
} & PageProps;

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const {
    data: { post },
  } = await getClient().query({
    query: GET_POST,
    variables: {
      postId: params.id,
    },
  });

  if (!post?.id) notFound();

  return {
    title: `${post.frontmatter?.title}${AppConstants.baseTitle}`,
    description: AppConstants.mainDescription,
  };
}

export default async function Page({ params }: Props) {
  const dict = await getDictionary(params.lang);
  const {
    data: { post },
  } = await getClient().query({
    query: GET_POST,
    variables: {
      postId: params.id,
    },
  });

  return (
    <>
      <PostDetails dict={dict} />
    </>
  );
}
