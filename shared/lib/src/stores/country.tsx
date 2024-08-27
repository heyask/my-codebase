import { atom } from 'recoil';
import { AppConstants } from 'core-types/constants';
import { localStorageEffect } from '../stores/index';

export const countryState = atom<
  (typeof AppConstants.COUNTRY)[keyof typeof AppConstants.COUNTRY]
>({
  key: 'countryState',
  effects: [
    localStorageEffect(
      AppConstants.APP_STORAGE_KEYS.country,
      (value?: keyof typeof AppConstants.COUNTRY) => {
        let country =
          AppConstants.COUNTRY[value || AppConstants.DEFAULT_COUNTRY_CODE];
        if (!country.isActive) {
          country = AppConstants.COUNTRY[AppConstants.DEFAULT_COUNTRY_CODE];
        }
        return country;
      },
      (
        object: (typeof AppConstants.COUNTRY)[keyof typeof AppConstants.COUNTRY]
      ) => object.code
    ),
  ],
});
