import * as React from 'react';
import { getDictionary } from '../../../dictionaries';
import ProjectDetails from '../../../../../components/project/project-details';
import { Metadata, ResolvingMetadata } from 'next';
import { getClient } from '../../../../../utils/apollo-client';
import { GET_PROJECT } from '../../../../../graphql/project';
import AppConstants from '../../../../../types/app-constants';

type Props = {
  params: { id: string; title: string };
  searchParams: { [key: string]: string | string[] | undefined };
} & PageProps;

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const {
    data: { project },
  } = await getClient().query({
    query: GET_PROJECT,
    variables: {
      projectId: params.id,
    },
  });

  return {
    title: `${project.frontmatter?.title}${AppConstants.baseTitle}`,
    description: AppConstants.mainDescription,
  };
}

export default async function Page({ params: { lang } }: Props) {
  const dict = await getDictionary(lang);

  return <ProjectDetails dict={dict} />;
}
