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

// Shared API configuration for all endpoints
export const FASTN_API_KEY = import.meta.env.VITE_FASTN_API_KEY || "238fb6b9-4e58-45b9-b49c-67ef5840ad21";
export const FASTN_SPACE_ID = import.meta.env.VITE_FASTN_SPACE_ID || "ee68d96c-075b-44a3-9847-44b74889f635";
export const API_URL = import.meta.env.VITE_API_URL|| "https://qa.fastn.ai/api/v1/"
// API URLs
export const INSERT_USER_API_URL = import.meta.env.VITE_INSERT_USER_API_URL || API_URL +"crudUser";
export const CRUD_CATEGORIES_API_URL = import.meta.env.VITE_CRUD_CATEGORIES_API_URL || API_URL +"crudCategories";
export const CRUD_TAGS_API_URL = import.meta.env.VITE_CRUD_TAGS_API_URL || API_URL +"crudTags";

// Separated topic endpoints
export const GET_TOPIC_BY_USER_API_URL = import.meta.env.VITE_GET_TOPIC_BY_USER_API_URL || API_URL +"getTopicByUser";
export const INSERT_TOPIC_TAGS_API_URL = import.meta.env.VITE_INSERT_TOPIC_TAGS_API_URL || API_URL +"insertTopicTags";
export const INSERT_TOPICS_API_URL = import.meta.env.VITE_INSERT_TOPICS_API_URL || API_URL +"insertTopics";
export const GET_TOPICS_API_URL = import.meta.env.VITE_GET_TOPICS_API_URL || API_URL +"getAllTopics";
export const CREATE_REPLY_API_URL = import.meta.env.VITE_CREATE_REPLY_API_URL || API_URL +"createReply";
export const GET_REPLIES_API_URL = import.meta.env.VITE_GET_REPLIES_API_URL || API_URL +"getReplies";
export const UPDATE_REPLY_API_URL = import.meta.env.VITE_UPDATE_REPLY_API_URL || API_URL +"updateReply";
export const DELETE_REPLY_API_URL = import.meta.env.VITE_DELETE_REPLY_API_URL || API_URL +"deleteReply";
export const UPDATE_TOPIC_STATUS_API_URL = import.meta.env.VITE_UPDATE_TOPIC_STATUS_API_URL || API_URL +"getTopicbystatus";
export const DELETE_TOPIC_API_URL = import.meta.env.VITE_DELETE_TOPIC_API_URL || API_URL +"DeleteTopic";
export const GET_ALL_USERS_API_URL = import.meta.env.VITE_GET_ALL_USERS_API_URL || API_URL +"getAllUsers";
export const SUBMIT_LIKES_API_URL = import.meta.env.VITE_SUBMIT_LIKES_API_URL || API_URL +"submitLikes";
export const REMOVE_LIKE_FROM_TOPIC_API_URL = import.meta.env.VITE_REMOVE_LIKE_FROM_TOPIC_API_URL || API_URL +"removeLikeFromTopic";
// Notifications
export const GET_NOTIFICATIONS_API_URL = import.meta.env.VITE_GET_NOTIFICATIONS_API_URL || API_URL + "notifications";
export const MARK_NOTIFICATION_READ_API_URL = import.meta.env.VITE_MARK_NOTIFICATION_READ_API_URL || API_URL + "notifications/read";
export const MARK_ALL_NOTIFICATIONS_READ_API_URL = import.meta.env.VITE_MARK_ALL_NOTIFICATIONS_READ_API_URL || API_URL + "notifications/markAllRead";