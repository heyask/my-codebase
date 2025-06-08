import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function urlSafeString(str: any) {
  return (
    String(str)
      .replace(/[^a-zA-Z0-9가-힇ㄱ-ㅎㅏ-ㅣぁ-ゔァ-ヴー々〆〤一-龥0-9]/gi, '-')
      // .replace(/[^\w\s]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  );
}
