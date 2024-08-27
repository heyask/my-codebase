import * as React from 'react';
import PostHome from '../../../components/post/post-home';
import { getDictionary } from '../dictionaries';
import { Metadata, ResolvingMetadata } from 'next';
import AppConstants from '../../../types/app-constants';

type Props = {
  params: { id: string; title: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: `Posts${AppConstants.baseTitle}`,
    description: AppConstants.mainDescription,
  };
}

export default async function Page({ params: { lang } }: PageProps) {
  const dict = await getDictionary(lang);

  return <PostHome dict={dict} />;
}
