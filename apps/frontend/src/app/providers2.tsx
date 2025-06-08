'use client';

import { RecoilRoot } from 'recoil';
import { headers } from 'next/headers';
import { ThemeState, themeState } from '@my-codebase/lib/stores/theme';
// import { meState } from '@/stores/me';
// import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { createLocaleCookie, createThemeStateCookie } from './actions';
// import { GET_ME } from '@/graphql/user';
import { appState, initialAppState } from '../stores/app';
import { usePathname } from 'next/navigation';
import { Lang, Theme } from '@my-codebase/lib/types';

export function Providers2({
  themeCookie,
  localeCookie,
  ip,
  className,
  children,
}: {
  themeCookie?: string;
  localeCookie?: string;
  playerCookie?: string;
  ip?: string | null;
  className?: string;
  children: React.ReactNode;
}) {
  // const { data } = useSuspenseQuery(GET_ME);
  const pathname = usePathname();

  return (
    <RecoilRoot
      initializeState={({ set }) => {
        // set(meState, data.me);
        set(appState, {
          ...initialAppState,
          ipAddr: ip || '',
        });

        try {
          themeCookie = JSON.parse(themeCookie || '');
        } catch {}
        if (themeCookie && typeof themeCookie === 'object') {
          set(themeState, themeCookie);
        } else {
          if (typeof window !== 'undefined') {
            const initialThemeCookie: ThemeState = {
              theme: Theme.system,
              selector:
                window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches
                  ? 'dark'
                  : 'light',
            };
            set(themeState, initialThemeCookie);
            createThemeStateCookie(initialThemeCookie);
          }
        }

        // let langStateFromCookie: LangState | undefined;
        // try {
        //   langStateFromCookie = JSON.parse(langCookie || '');
        //   const lang = pathname.split('/')[1];
        //   langStateFromCookie = {
        //     lang: lang,
        //     selector: lang,
        //   };
        // } catch {}
        // if (langStateFromCookie && typeof langStateFromCookie === 'object') {
        // } else {
        //   if (typeof window !== 'undefined') {
        //     const initialLangState: LangState = {
        //       lang: Lang.system,
        //       selector: Lang.en,
        //     };
        //     langStateFromCookie = initialLangState;
        //   }
        // }
        // if (langStateFromCookie) {
        //   set(langState, langStateFromCookie);
        //   if (typeof window !== 'undefined') {
        //     createLangStateCookie(langStateFromCookie);
        //   }
        // }

        let localeFromCookie: Lang | undefined;
        try {
          localeFromCookie = JSON.parse(localeCookie || '');
          const lang = pathname.split('/')[1];
          // localeFromCookie = ;
        } catch {}
      }}
    >
      {children}
    </RecoilRoot>
  );
}
