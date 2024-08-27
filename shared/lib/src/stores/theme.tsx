import { atom } from 'recoil';
import { Theme } from '../types';

export type ThemeState = { theme: Theme; selector: Theme };
export const initialThemeState: ThemeState = {
  theme: Theme.system,
  selector: Theme.light,
};
export const themeState = atom<ThemeState>({
  key: 'themeState',
  default: initialThemeState,
  // effects: [
  //   ({ setSelf, onSet }: any) => {
  //     onSet((newValue: ThemeState, oldValue: ThemeState, isReset: boolean) => {
  //       let selector = newValue.theme;
  //       if (typeof window !== 'undefined' && newValue.theme === Theme.system) {
  //         selector =
  //           window.matchMedia &&
  //           window.matchMedia('(prefers-color-scheme: dark)').matches
  //             ? Theme.dark
  //             : Theme.light;
  //       }
  //       // createThemeStateCookie({
  //       //   ...newValue,
  //       //   selector: selector,
  //       // });
  //     });
  //
  //     return () => {};
  //   },
  // ],
});
