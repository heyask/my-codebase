export const AboutType = {
  cv: 'cv',
  resume: 'resume',
} as const;
export type AboutType = (typeof AboutType)[keyof typeof AboutType];
