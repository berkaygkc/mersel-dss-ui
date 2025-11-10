// Runtime Configuration Helper
// Allows runtime configuration via window.APP_CONFIG (Kubernetes ConfigMap)

interface AppConfig {
  SIGN_API_URL: string;
  VERIFY_API_URL: string;
}

declare global {
  interface Window {
    APP_CONFIG?: AppConfig;
  }
}

// Get runtime config with fallback to build-time env vars
export const getRuntimeConfig = (): AppConfig => {
  return {
    SIGN_API_URL: window.APP_CONFIG?.SIGN_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:8085',
    VERIFY_API_URL: window.APP_CONFIG?.VERIFY_API_URL || import.meta.env.VITE_VERIFY_API_URL || 'http://localhost:8086',
  };
};

export const SIGN_API_URL = () => getRuntimeConfig().SIGN_API_URL;
export const VERIFY_API_URL = () => getRuntimeConfig().VERIFY_API_URL;

