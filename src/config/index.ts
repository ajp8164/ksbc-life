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
  persistStoreVersion: string;
  privacyUrl: string;
  sentryEndpoint: string;
  sentryLoggingEnabled: boolean;
  storageSchemaVersion: number;
  supportEmail: string;
  supportUrl: string;
  websiteUrl: string;
}

export const appConfig: AppConfig = {
  appName: Config.APP_NAME || '',
  buildEnvironment: Config.BUILD_ENVIRONMENT || '',
  businessName: Config.BUSINESS_NAME || '',
  businessNameShort: Config.BUSINESS_NAME_SHORT || '',
  deepLinkScheme: Config.DEEP_LINK_SCHEME || '',
  environment: Config.ENVIRONMENT || '',
  firebaseOauthClientId: Config.FIREBASE_OAUTH_CLIENT_ID || '',
  persistStoreVersion: Config.PERSIST_STORE_VERSION || '',
  privacyUrl: Config.PRIVACY_URL || '',
  sentryEndpoint: Config.SENTRY_ENDPOINT || '',
  sentryLoggingEnabled: Config.SENTRY_LOGGING_ENABLED === 'true' ? true : false,
  storageSchemaVersion: Number(Config.STORAGE_SCHEMA_VERSION) || 0,
  supportEmail: Config.SUPPORT_EMAIL || '',
  supportUrl: Config.SUPPORT_URL || '',
  websiteUrl: Config.WEBSITE_URL || '',
};
