import { atom } from 'recoil';

export const cartModalState = atom<boolean>({
  key: 'cartModalState',
  default: false,
});
