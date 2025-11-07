import { OpenAPI } from '@/api/generated';

// Configure the generated OpenAPI client
OpenAPI.BASE = import.meta.env.VITE_API_URL || 'http://localhost:8085';
OpenAPI.WITH_CREDENTIALS = false; // CORS için false
OpenAPI.CREDENTIALS = 'omit'; // credentials gönderme

// You can add request interceptor here if needed
OpenAPI.interceptors = {
  request: async (config) => {
    // Add auth token or other headers here if needed
    return config;
  },
  response: async (response) => {
    return response;
  },
};

export { OpenAPI };

