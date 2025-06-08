import { atom } from 'recoil';
import { IUser } from 'core-types/interfaces';

export const meState = atom<IUser | undefined | null>({
  key: 'meState',
  default: undefined,
});
