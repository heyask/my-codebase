import { atom } from 'recoil';
import { ICartItem } from 'core-types/interfaces';
import { AppConstants } from 'core-types/constants';
import { localStorageEffect } from './index';

export const cartState = atom<ICartItem[]>({
  key: 'cartState',
  effects: [
    localStorageEffect(
      AppConstants.APP_STORAGE_KEYS.cart,
      (value) => value ?? [],
      (object) => object
    ),
  ],
});
