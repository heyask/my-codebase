'use client';

import React from 'react';
import { useRecoilState } from 'recoil';
import { themeState } from '@my-workspace/lib/stores/theme';
import { upperCase } from 'lodash-es';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { createLocaleCookie } from '../../app/actions';
import Link from 'next/link';
import { Button } from '@my-workspace/ui/button';
import Image from 'next/image';
import { Icon } from '@my-workspace/ui/icon';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@my-workspace/ui/navigation-menu';
import { Lang, Theme } from '@my-workspace/lib/types';

export default function Header() {
  const params = useParams();
  const [theme, setTheme] = useRecoilState(themeState);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isLoadingLocale, setIsLoadingLocale] = React.useState(false);
  const menuItems = [
    {
      title: 'About',
      href: `/about`,
    },
    {
      title: 'Posts',
      href: `/posts`,
    },
    {
      title: 'Projects',
      href: `/projects`,
    },
  ];

  return (
    <header
      // id="header"
      className="flex justify-center items-center"
      // position="sticky"
      // classNames={{
      //   base: 'py-4 backdrop-filter-none bg-transparent',
      //   wrapper: 'px-0 w-full justify-center bg-transparent',
      //   item: 'hidden md:flex',
      // }}
      // height="54px"
      // isMenuOpen={isMenuOpen}
      // onMenuOpenChange={setIsMenuOpen}
    >
      <div
        className="flex items-stretch gap-4 rounded-full border-small border-default-200/20 bg-background/60 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50 my-8 p-2 shadow-xl shadow-accent border border-accent"
        // justify="center"
      >
        {/* Toggle */}
        <div className="ml-2 md:hidden" />

        {/* Logo */}
        <div className="mr-2 sm:mr-12 w-[40vw] md:w-auto md:max-w-fit">
          <Link href="/" className="flex items-center">
            <Image
              className="aspect-square w-10 h-10 hover:scale-105 active:scale-100 rounded-full"
              src="/assets/images/profile-pic.reduced.jpg"
              alt="logo"
              width={50}
              height={50}
            />
            <span className="ml-2 font-medium">Andy Kim</span>
          </Link>
        </div>

        <NavigationMenu>
          <NavigationMenuList>
            {menuItems.map((item, index) => (
              <NavigationMenuItem key={`menu-${item.title}`}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-2 sm:ml-12 flex items-center">
          <Button
            variant="secondary"
            className="rounded-full"
            // radius="full"
            // variant="flat"
            // isIconOnly
            isLoading={isLoadingLocale}
            onClick={async (e) => {
              setIsLoadingLocale(true);
              try {
                const prevLang = pathname.split('/')[1];
                const newLang = prevLang === Lang.en ? Lang.ko : Lang.en;
                await createLocaleCookie(newLang);
                router.replace(pathname.replace(`/${prevLang}`, `/${newLang}`));
              } catch (e) {
                console.error(e);
              }
              setIsLoadingLocale(false);
            }}
          >
            {upperCase(String(params.lang))}
          </Button>
        </div>
        <div className="flex items-center">
          <Button
            variant="secondary"
            className="rounded-full"
            // radius="full"
            // variant="flat"
            // isIconOnly
            onClick={(e) => {
              setTheme((prev) => ({
                ...prev,
                theme: prev.selector === Theme.light ? Theme.dark : Theme.light,
                selector:
                  prev.selector === Theme.light ? Theme.dark : Theme.light,
              }));
            }}
          >
            <Icon
              icon={`solar:${theme.selector === Theme.light ? 'sun-2' : 'moon'}-linear`}
              width={24}
            />
          </Button>
        </div>
      </div>

      {/*<div*/}
      {/*  className="top-[calc(var(--navbar-height)/2)] mx-auto mt-16 max-h-[40vh] max-w-[80vw] rounded-large border-small border-default-200/20 bg-background/60 py-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"*/}
      {/*  // motionProps={{*/}
      {/*  //   initial: { opacity: 0, y: -20 },*/}
      {/*  //   animate: { opacity: 1, y: 0 },*/}
      {/*  //   exit: { opacity: 0, y: -20 },*/}
      {/*  //   transition: {*/}
      {/*  //     ease: 'easeInOut',*/}
      {/*  //     duration: 0.2,*/}
      {/*  //   },*/}
      {/*  // }}*/}
      {/*>*/}
      {/*  {menuItems.map((item, index) => (*/}
      {/*    <div key={`${item}-${index}`}>*/}
      {/*      <Link*/}
      {/*        className={cn('w-full text-sky-400', {*/}
      {/*          'text-default-500': !pathname.startsWith(*/}
      {/*            `/${params.lang}${item.href}`*/}
      {/*          ),*/}
      {/*        })}*/}
      {/*        color="foreground"*/}
      {/*        href={item.href}*/}
      {/*        // size="md"*/}
      {/*        // onPress={(e) => {*/}
      {/*        //   setIsMenuOpen(false);*/}
      {/*        // }}*/}
      {/*      >*/}
      {/*        {item.title}*/}
      {/*      </Link>*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*</div>*/}
    </header>
  );
}
