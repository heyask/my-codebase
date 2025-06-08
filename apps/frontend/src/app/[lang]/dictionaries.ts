import 'server-only';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  ko: () => import('./dictionaries/ko.json').then((module) => module.default),
};

export type Dictionary = typeof import('./dictionaries/en.json') &
  typeof import('./dictionaries/ko.json');

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
