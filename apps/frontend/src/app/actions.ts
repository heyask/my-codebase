'use server';

import { cookies } from 'next/headers';
import { ThemeState } from '@my-codebase/lib/stores/theme';
import { Lang } from '@my-codebase/lib/types';

export async function createAccessToken(accessToken: string) {
  cookies().set('accessToken', accessToken);
}

export async function removeAccessToken() {
  cookies().delete('accessToken');
}

export async function createThemeStateCookie(theme: ThemeState) {
  cookies().set('theme', JSON.stringify(theme));
}

export async function createLocaleCookie(lang: Lang) {
  cookies().set('locale', lang);
}
