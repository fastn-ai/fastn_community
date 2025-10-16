// Authentication constants
export const KEYCLOAK_CLIENT_ID = "fastn-app";
export const USER_SIGN_IN_FLAG_NAME = "user_sign_in_flag";
export const CUSTOM_AUTH_KEY = "custom_auth_enabled";
export const CUSTOM_AUTH_TOKEN_KEY = "custom_auth_token";
export const TENANT_ID_KEY = "tenant_id";
export const WORKSPACE_ID_KEY = "workspace_id";
export const KEYCLOAK_REALM = "fastn";

// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Development mode - set to true to bypass Keycloak authentication
export const DEV_MODE_AUTH = import.meta.env.VITE_DEV_MODE_AUTH === 'true' || false;

// Other constants
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
