import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
//
// let headers = { 'accept-language': 'en-US,en;q=0.5' }
// let languages = new Negotiator({ headers }).languages()
// let locales = ['en-US', 'nl-NL', 'nl']
// let defaultLocale = 'en-US'
//
// match(languages, locales, defaultLocale) // -> 'en-US'

let supportedLocales = ['en', 'ko'];
let defaultLocale = 'en';

function getLocale(request: NextRequest, userLocale?: string) {
  let headers = { 'accept-language': `${supportedLocales.join(',')};q=0.5` };
  let userLocales = new Negotiator({ headers }).languages();
  if (userLocale) {
    userLocales.unshift(userLocale);
  }
  return match(userLocales, supportedLocales, defaultLocale); // -> 'en-US'
}

export function middleware(request: NextRequest) {
  let res = NextResponse.next();
  const parsed = new URL(request.url);
  if (process.env.NODE_ENV === 'production') {
    console.log(
      ` ${request.method} ${parsed.pathname}?${parsed.searchParams} ${res.status}`
    );
  }

  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = supportedLocales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  let localeFromCookie: string | undefined;
  try {
    localeFromCookie = request.cookies.get('locale')?.value; //JSON.parse();
  } catch {}
  if (pathnameHasLocale) {
    if (localeFromCookie !== pathnameHasLocale) {
      res.cookies.set('locale', pathnameHasLocale);
    }

    return res;
  }

  // Redirect if there is no locale
  const locale = getLocale(request, localeFromCookie);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  res = NextResponse.redirect(request.nextUrl);

  return res;
  // const parsed = new URL(request.url);
  // const response = NextResponse.next();
  // if (process.env.NODE_ENV === 'production') {
  //   console.log(
  //     ` ${request.method} ${parsed.pathname}?${parsed.searchParams} ${response.status}`
  //   );
  // }
  //
  // return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|assets|uploads).*)',
  ],
};
