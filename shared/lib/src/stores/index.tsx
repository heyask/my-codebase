import { AppStorage } from '../utils/app-storage';

export const localStorageEffect =
  (
    key: string,
    valueToObject: (value: any) => any,
    objectToValue: (object: any) => any
  ) =>
  ({ setSelf, onSet }: any) => {
    const savedValue = AppStorage.get(key);
    try {
      setSelf(valueToObject(savedValue));
    } catch (e) {
      setSelf(savedValue);
    }

    onSet((newValue: any, oldValue: any, isReset: boolean) => {
      AppStorage.set(
        key,
        objectToValue(newValue),
        new Date().getTime() + 1000 * 60 * 60 * 24 * 7
      );
    });
    return () => {};
  };
