import { OpenAPI } from '@/api/generated';
import { SIGN_API_URL } from './runtime-config';

// Configure the generated OpenAPI client
// Use runtime config for Kubernetes compatibility
OpenAPI.BASE = SIGN_API_URL();
OpenAPI.WITH_CREDENTIALS = false; // CORS için false
OpenAPI.CREDENTIALS = 'omit'; // credentials gönderme


export { OpenAPI };

