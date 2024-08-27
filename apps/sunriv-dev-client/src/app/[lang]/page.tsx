import * as React from 'react';
import Home from '../../components/home';
import { getDictionary } from './dictionaries';
import { Metadata, ResolvingMetadata } from 'next';
import AppConstants from '../../types/app-constants';

type Props = {
  params: { id: string; title: string };
  searchParams: { [key: string]: string | string[] | undefined };
} & PageProps;

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: `${AppConstants.mainTitle}`,
    description: AppConstants.mainDescription,
  };
}

export default async function Page({ params: { lang } }: Props) {
  const dict = await getDictionary(lang);

  return <div>
    <Home dict={dict} />
  </div>;
}
