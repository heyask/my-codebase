import { atom } from 'recoil';

export type AppState = {
  ipAddr: string;
};
export const initialAppState: AppState = {
  ipAddr: '',
};
export const appState = atom<AppState>({
  key: 'appState',
  default: initialAppState,
});
