import * as React from 'react';
import ProjectHome from '../../../components/project/project-home';
import { getDictionary } from '../dictionaries';
import { Metadata, ResolvingMetadata } from 'next';
import AppConstants from '../../../types/app-constants';
import { getClient } from '../../../utils/apollo-client';
import { GET_PROJECTS } from '../../../graphql/project';

type Props = {
  params: { id: string; title: string };
  searchParams: { [key: string]: string | string[] | undefined };
} & PageProps;

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const {
    data: { projects },
  } = await getClient().query({
    query: GET_PROJECTS,
  });

  return {
    title: `Projects${AppConstants.baseTitle}`,
    description: AppConstants.mainDescription,
  };
}

export default async function Page({ params: { lang } }: Props) {
  const dict = await getDictionary(lang);

  return <ProjectHome dict={dict} />;
}
