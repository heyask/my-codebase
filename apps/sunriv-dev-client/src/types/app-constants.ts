const AppConstants: {
  DEPLOY_ENV: string;
  CLIENT_HOST: string;
  API_HOST: string;
  FILE_HOST: string;
  GA_TRACKING_ID: string;
  baseTitle: string;
  mainTitle: string;
  mainDescription: string;
} = {
  DEPLOY_ENV: (process.env.DEPLOY_ENV || process.env.NEXT_PUBLIC_DEPLOY_ENV) as
    | 'local'
    | 'development'
    | 'production',
  CLIENT_HOST:
    process.env.CLIENT_NEXT_PUBLIC_CLIENT_HOST ||
    process.env.NEXT_PUBLIC_CLIENT_HOST!,
  API_HOST:
    process.env.CLIENT_NEXT_PUBLIC_API_HOST ||
    process.env.NEXT_PUBLIC_API_HOST!,
  FILE_HOST:
    process.env.CLIENT_NEXT_PUBLIC_FILE_HOST ||
    process.env.NEXT_PUBLIC_FILE_HOST!,
  GA_TRACKING_ID:
    process.env.CLIENT_NEXT_PUBLIC_GA_TRACKING_ID ||
    process.env.NEXT_PUBLIC_GA_TRACKING_ID!,
  baseTitle: ' : Andy Kim',
  mainTitle: 'Andy Kim',
  mainDescription: 'Blog',
};
export default AppConstants;
