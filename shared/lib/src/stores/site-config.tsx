import { atom } from 'recoil';
import { ISiteConfig } from 'core-types/interfaces';

export const siteConfigState = atom<ISiteConfig | undefined>({
  key: 'siteConfigState',
  default: undefined,
});
