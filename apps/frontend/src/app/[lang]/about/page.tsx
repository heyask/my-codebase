import * as React from 'react';
import AboutHome from '../../../components/about/about-home';
import { Metadata } from 'next';
import AppConstants from '../../../types/app-constants';
import { getDictionary } from '../dictionaries';

type Props = {
  params: { id: string; title: string };
  searchParams: { [key: string]: string | string[] | undefined };
} & PageProps;

export const metadata: Metadata = {
  title: `About${AppConstants.baseTitle}`,
  description: AppConstants.mainDescription,
};

export default async function Page({ params: { lang } }: Props) {
  const dict = await getDictionary(lang);

  return <AboutHome dict={dict} />;
}
