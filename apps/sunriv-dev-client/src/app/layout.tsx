import React from 'react';
import type { Metadata } from 'next';
// import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import Script from 'next/script';
import localFont from 'next/font/local';
import { Providers } from './providers';
import MainLayout from '../components/layout/main-layout';
import { cookies, headers } from 'next/headers';
import AppConstants from '../types/app-constants';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import '@my-workspace/ui/globals.css';
import './globals.css';

// if (AppConfig.DEPLOY_ENV !== 'production') {
//   // Adds messages only in a dev environment
//   // loadDevMessages();
//   loadErrorMessages();
// }
const pretendard = localFont({
  src: [
    {
      path: './assets/fonts/pretendard/woff2/Pretendard-Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: './assets/fonts/pretendard/woff2/Pretendard-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: './assets/fonts/pretendard/woff2/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './assets/fonts/pretendard/woff2/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './assets/fonts/pretendard/woff2/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './assets/fonts/pretendard/woff2/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './assets/fonts/pretendard/woff2/Pretendard-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './assets/fonts/pretendard/woff2/Pretendard-ExtraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: './assets/fonts/pretendard/woff2/Pretendard-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
  ],
  display: 'swap',
});

export const metadata: Metadata = {
  title: AppConstants.mainTitle,
  description: AppConstants.mainDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ip = headers().get('x-forwarded-for');
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');
  const theme = cookieStore.get('theme');
  const locale = cookieStore.get('locale');

  return (
    <>
      {/* Google Analytics */}
      {AppConstants.DEPLOY_ENV === 'production' && (
        <React.Fragment>
          <Script
            id="google-analytics-0"
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-D845K3H5F2"
          />
          <Script id="google-analytics-1">
            {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-D845K3H5F2');
`}
          </Script>
        </React.Fragment>
      )}
      <Providers
        className={pretendard.className}
        accessToken={accessToken?.value}
        themeCookie={theme?.value}
        localeCookie={locale?.value}
        ip={ip}
      >
        <MainLayout>{children}</MainLayout>
        <SpeedInsights />
        <Analytics />
      </Providers>
    </>
  );
}
