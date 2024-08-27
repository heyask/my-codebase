import { atom } from 'recoil';
import { AppConstants } from 'core-types/constants';
import { localStorageEffect } from './index';

export const currencyState = atom<
  (typeof AppConstants.CURRENCY)[keyof typeof AppConstants.CURRENCY]
>({
  key: 'currencyState',
  effects: [
    localStorageEffect(
      AppConstants.APP_STORAGE_KEYS.currency,
      (value?: keyof typeof AppConstants.CURRENCY) =>
        AppConstants.CURRENCY[value || AppConstants.DEFAULT_CURRENCY_CODE],
      (
        object: (typeof AppConstants.CURRENCY)[keyof typeof AppConstants.CURRENCY]
      ) => object.code
    ),
  ],
});
