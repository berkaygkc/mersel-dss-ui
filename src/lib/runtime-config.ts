// Runtime Configuration Helper
// Allows runtime configuration via window.APP_CONFIG (Kubernetes ConfigMap)

const DEFAULT_SIGN_API_URL = 'http://localhost:8085';
const DEFAULT_VERIFY_API_URL = 'http://localhost:8086';

interface AppConfig {
  SIGN_API_URL: string;
  VERIFY_API_URL: string;
}

declare global {
  interface Window {
    APP_CONFIG?: Partial<AppConfig>;
  }
}

// Get runtime config with fallback to defaults
export const getRuntimeConfig = (): AppConfig => {
  return {
    SIGN_API_URL: window.APP_CONFIG?.SIGN_API_URL || DEFAULT_SIGN_API_URL,
    VERIFY_API_URL: window.APP_CONFIG?.VERIFY_API_URL || DEFAULT_VERIFY_API_URL,
  };
};

export const SIGN_API_URL = () => getRuntimeConfig().SIGN_API_URL;
export const VERIFY_API_URL = () => getRuntimeConfig().VERIFY_API_URL;

