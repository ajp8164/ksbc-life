import Config from 'react-native-config';

export interface AppConfig
  extends Record<string, string | string[] | boolean | number | undefined> {
  appName: string;
  buildEnvironment: string;
  businessName: string;
  businessNameShort: string;
  deepLinkScheme: string;
  environment: string;
  firebaseOauthClientId: string;
  givingUrl: string;
  googleSignInWebClientId: string;
  persistStoreVersion: string;
  privacyUrl: string;
  requireReAuthDays: number;
  sentryEndpoint: string;
  sentryLoggingEnabled: boolean;
  storageFileChat: string;
  storageImageChat: string;
  storageImageChurch: string;
  storageImageGroups: string;
  storageImageLocations: string;
  storageImagePastors: string;
  storageImagePageContentItems: string;
  storageSchemaVersion: number;
  storageVideoChat: string;
  supportEmail: string;
  supportUrl: string;
  websiteUrl: string;
  youTubeApiKey: string;
  youTubeApiUrl: string;
  youTubeChannelId: string;
}

export const appConfig: AppConfig = {
  appName: Config.APP_NAME || '',
  buildEnvironment: Config.BUILD_ENVIRONMENT || '',
  businessName: Config.BUSINESS_NAME || '',
  businessNameShort: Config.BUSINESS_NAME_SHORT || '',
  deepLinkScheme: Config.DEEP_LINK_SCHEME || '',
  environment: Config.ENVIRONMENT || '',
  firebaseOauthClientId: Config.FIREBASE_OAUTH_CLIENT_ID || '',
  givingUrl: Config.GIVING_URL || '',
  googleSignInWebClientId: Config.GOOGLE_SIGN_IN_WEB_CLIENT_ID || '',
  persistStoreVersion: Config.PERSIST_STORE_VERSION || '',
  privacyUrl: Config.PRIVACY_URL || '',
  requireReAuthDays: Number(Config.REQUIRE_REAUTH_DAYS) || 0,
  sentryEndpoint: Config.SENTRY_ENDPOINT || '',
  sentryLoggingEnabled: Config.SENTRY_LOGGING_ENABLED === 'true' ? true : false,
  storageFileChat: Config.STORAGE_FILE_CHAT || '',
  storageImageChat: Config.STORAGE_IMAGE_CHAT || '',
  storageImageChurch: Config.STORAGE_IMAGE_CHURCH || '',
  storageImageGroups: Config.STORAGE_IMAGE_GROUPS || '',
  storageImageLocations: Config.STORAGE_IMAGE_LOCATIONS || '',
  storageImagePastors: Config.STORAGE_IMAGE_PASTORS || '',
  storageImagePageContentItems: Config.STORAGE_IMAGE_SCREEN_CONTENT_ITEMS || '',
  storageSchemaVersion: Number(Config.STORAGE_SCHEMA_VERSION) || 0,
  storageVideoChat: Config.STORAGE_VIDEO_CHAT || '',
  supportEmail: Config.SUPPORT_EMAIL || '',
  supportUrl: Config.SUPPORT_URL || '',
  websiteUrl: Config.WEBSITE_URL || '',
  youTubeApiKey: Config.YOUTUBE_API_KEY || '',
  youTubeApiUrl: Config.YOUTUBE_API_URL || '',
  youTubeChannelId: Config.YOUTUBE_CHANNEL_ID || '',
};
