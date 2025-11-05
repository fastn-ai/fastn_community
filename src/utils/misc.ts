import { useEffect } from "react";
import { AppRoutes } from "./config";
import { decodeJWT } from "@/context/permissions-provider";
import {
  CUSTOM_AUTH_KEY,
  CUSTOM_AUTH_TOKEN_KEY,
  TENANT_ID_KEY,
  WORKSPACE_ID_KEY,
  KEYCLOAK_REALM,
} from "@/constants";
import { v4 as uuid } from "uuid";
import { getCookie } from "@/routes/login/oauth";
import { formatJSON } from "@/utils/editor/utils-functions";
import { notify } from "@/components/toaster/toaster";

export enum Service {
  widget = "widget",
  keycloak = "auth",
  backend = "api",
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const useScrollToTop = () => {
  useEffect(() => {
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.scrollTop = 0;
    }
  }, []);
};

export const getAppolloErrorMessage = error => {
  if (error?.message) {
    return error?.message;
  }
  return "Something went wrong";
};

interface ErrorResponse {
  status: number;
  statusText: string;
  body: any;
}

interface NetworkError {
  networkError: string;
}

type FetchResult<T> = T | ErrorResponse | NetworkError;

export async function customFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<FetchResult<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      referrerPolicy: "no-referrer",
    });

    if (!response.ok) {
      const errorData: ErrorResponse = {
        status: response.status,
        statusText: response.statusText,
        body: response.headers.get("content-type")?.includes("application/json")
          ? await response.json()
          : await response.text(),
      };

      throw errorData;
    }

    // Handle successful response
    if (response.headers.get("content-type")?.includes("application/json")) {
      return (await response.json()) as T;
    } else {
      return (await response.text()) as T;
    }
  } catch (error) {
    // Handle network errors or other exceptions
    const networkError: NetworkError = {
      networkError: "Network error occurred",
    };
    throw networkError;
  }
}

export const filterHeaders = (headers: any[] = []) => {
  try {
    let updatedHeaders = [] as any[];
    headers?.forEach(header => {
      if (!header?.key) return;
      updatedHeaders.push({
        key: header?.key,
        value: header?.value,
      });
    });
    return updatedHeaders;
  } catch (error) {
    return [];
  }
};

export function getCurrentDate(year = 0, month = 0, day = 0) {
  const currentDate = new Date();
  const nextMonthDate = new Date(
    currentDate.getFullYear() + year,
    currentDate.getMonth() + month,
    currentDate.getDate() + day
  );
  const formattedDate = nextMonthDate.toISOString().slice(0, 10);
  return formattedDate;
}

export function isExpired(isoString) {
  if (!isoString) return false;
  const currentDate = new Date().toISOString();
  return currentDate > isoString;
}

export const sanitizeSchema = (schema: any[]) => {
  try {
    const BLACKLISTED_KEYS = ["Name", "ID"];
    let sanitizedSchema: any[] = [];

    // First, filter out blacklisted keys
    schema.forEach(column => {
      if (!BLACKLISTED_KEYS.includes(column?.column_name)) {
        sanitizedSchema.push(column);
      }
    });

    // Then, remove duplicates based on the column_name
    sanitizedSchema = sanitizedSchema.filter(
      (column, index, self) =>
        index ===
        self.findIndex(
          t =>
            t?.column_name.toLowerCase() === column?.column_name.toLowerCase()
        )
    );

    return sanitizedSchema;
  } catch (error) {
    return schema;
  }
};

export const getOrgIdFromJWT = (token: string) => {
  const roles = decodeJWT(token)?.payload?.realm_access?.roles;
  if (!roles || roles?.length === 0) return null;
  const orgId = roles.find(role => role.toLowerCase().includes("org#"));
  return orgId?.split("#")[1];
};

// --------------------- Keycloak ---------------------

export const getSendMessageApiKey = () => {
  switch (window.location.hostname) {
    case "localhost":
      return import.meta.env.VITE_APP_SEND_NOTIFICATION_APIKEY as string;
    case "app.fastn.ai":
    case "fastn.ai":
    case "live.fastn.ai":
      return "b1d7d00a-0636-42cd-8ac4-a56e9477a1bd";
    case "hp-poc.fastn.ai":
      return "f14879c1-7259-4979-98b6-f0a4d97f2fdf";
    case "qa.fastn.ai":
      return "d3c3ea2c-6186-4331-afde-5d997a63c0a5";
    default:
      return import.meta.env.VITE_APP_SEND_NOTIFICATION_APIKEY as string;
  }
};

// --------------------- Get Environment From Hostname ---------------------
export const getEnvironmentFromHostname = () => {
  const hostname = window.location.hostname;
  
  // Handle community subdomains specifically
  if (hostname === "community.qa.fastn.ai" || hostname.includes("community.qa.fastn.ai")) {
    return "QA";
  } else if (hostname === "community.live.fastn.ai" || hostname.includes("community.live.fastn.ai")) {
    return "Live";
  } else if (hostname.includes("qa.fastn.ai")) {
    return "QA";
  } else if (hostname.includes("live.fastn.ai") || hostname.includes("fastn.ai")) {
    return "Live";
  }
  
  switch (hostname) {
    case "localhost":
      return "Localhost";
    case "app.dev.fastn.ai":
    case "Dev":
      return "Live";
    case "app.hp-poc.fastn.ai":
      return "HP";
    default:
      return "unknown";
  }
};

// --------------------- Local Storage ---------------------

export const storeObjectInLocalStorage = (key, obj) => {
  const jsonStr = JSON.stringify(obj);
  localStorage.setItem(key, jsonStr);
};

export const getObjectFromLocalStorage = key => {
  const jsonStr = localStorage.getItem(key);
  if (!jsonStr) return null;
  return JSON.parse(jsonStr);
};

// ------------------------- json -------------------------

export function extractBraceContent(input: string): string[] {
  try {
    const matches: string[] = [];

    const pattern: RegExp = /\{\{([^}}]+)}}/g;

    let match;
    while ((match = pattern.exec(input)) !== null) {
      const matchedContent: string = match[1];
      matches.push(matchedContent);
    }

    return matches;
  } catch (error) {
    return [];
  }
}

// url

export function decodeURLToObject(encodedString) {
  try {
    const jsonString = decodeURIComponent(encodedString);
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

export function encodeObjectToURL(obj) {
  const jsonString = JSON.stringify(obj);
  return encodeURIComponent(jsonString);
}

// ----- validation

export function validateDataSize(data: any, size = 20000) {
  try {
    if (typeof data === "object") data = JSON.stringify(data);
    return data?.trim()?.length <= size;
  } catch (error) {
    return false;
  }
}

export const isJSONEmpty = json => {
  try {
    if (typeof json === "string") json = JSON.parse(json);
    return Object.keys(json).length === 0;
  } catch (error) {
    return true;
  }
};

export function extractOrgIdFromPath(path = window.location.pathname) {
  path = path.replace(getFirstPath(), "");
  const regex =
    /^\/projects\/[^\/]+\/(?:api\/templates|connectors|settings\/models)\/([^\/]+)/;
  const match = path.match(regex);
  return match ? match[1] : null;
}

export function extractProjectIdFromPath(path = window.location.pathname) {
  path = path.replace(getFirstPath(), "");
  const regex = /^\/projects\/([^\/]+)(?:\/|$)/;
  const match = path?.match(regex);
  return match ? match?.[1] : null;
}

export function extractProjectIdFromParams(search = window.location.search) {
  const params = new URLSearchParams(search);
  const projectId = params.get("projectId");
  return projectId;
}

export const getClientRequestHeaders = (user: any, isOrgLevel = false) => {
  const accessToken =
    user?.access_token || localStorage.getItem("authorization");
  const spaceId =
    extractProjectIdFromPath(window.location.pathname) ||
    extractProjectIdFromParams(window.location.search) ||
    localStorage.getItem(window.location.pathname + "_projectId") ||
    getOrgIdFromJWT(accessToken) ||
    "public";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    authorization: accessToken ? `Bearer ${accessToken}` : "",
    realm: KEYCLOAK_REALM,
    "x-tenant": "organization",
    "x-fastn-request-trace-id": "web-" + uuid(),
  };

  if (isOrgLevel) {
    headers["x-fastn-space-id"] = extractOrgIdFromPath() || "";
  } else {
    headers["x-fastn-space-id"] = spaceId;
  }

  if (
    getCookie(CUSTOM_AUTH_KEY) === "true" &&
    isPathWihtListedForCustomAuth()
  ) {
    headers[CUSTOM_AUTH_KEY] = "true";
    headers["authorization"] = `Bearer ${getCookie(CUSTOM_AUTH_TOKEN_KEY)}`;
    headers[TENANT_ID_KEY] = getCookie(TENANT_ID_KEY) || "";
    headers[WORKSPACE_ID_KEY] = getCookie(WORKSPACE_ID_KEY) || "";
  }

  return headers;
};

export function getDocUrl() {
  return "https://docs.fastn.ai";
}

export function maskEmail(email: string) {
  try {
    const emailParts = email?.split("@");
    const maskedEmail = `${emailParts[0]?.slice(0, 2)}****@${emailParts[1]}`;
    return maskedEmail;
  } catch (e) {
    return email;
  }
}

export function isPathWihtListedForCustomAuth() {
  const path = window.location.pathname;
  const paths = ["/oauth"];
  return paths.includes(path);
}

export function clearCustomAuthConfigFromCookie() {
  document.cookie = `${CUSTOM_AUTH_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; path=/; SameSite=Lax; Secure;`;
  document.cookie = `${CUSTOM_AUTH_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; path=/; SameSite=Lax; Secure;`;
  document.cookie = `${TENANT_ID_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; path=/; SameSite=Lax; Secure;`;
  document.cookie = `${WORKSPACE_ID_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; path=/; SameSite=Lax; Secure;`;
}

export function downloadFileWithContent(content, fileName) {
  try {
    const url = window.URL.createObjectURL(new Blob([formatJSON(content)]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName + ".json");
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    notify.error("Failed to export swagger");
  }
}

export function downloadFileFlowsWithContent(content, fileName) {
  try {
    const date = new Date().toISOString().split("T")[0];
    const fullFileName = `${fileName}_${date}.json`;
    const url = window.URL.createObjectURL(new Blob([formatJSON(content)]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fullFileName);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    notify.error("Failed to export flows");
  }
}

export function getSpaceIdFromVariables(variables: any) {
  try {
    return (
      variables?.input?.orgId ||
      variables?.input?.projectId ||
      variables?.input?.connectorId ||
      variables?.input?.clientId ||
      variables?.orgId ||
      variables?.projectId ||
      variables?.organizationId ||
      variables?.id
    );
  } catch (error) {
    return extractProjectIdFromPath();
  }
}

// --------------------- Services URL --------------------- //

export const getOrigin = () => {
  const firstPath = window.location.pathname.match(/\/([^/]+)/)?.[0] || "";
  if (firstPath === "/app") {
    return window.location.origin + "/app"?.trim();
  }
  return window.location.origin;
};

export const getPath = () => {
  const firstPath = window.location.pathname.match(/\/([^/]+)/)?.[0] || "";
  if (firstPath === "/app") {
    return window.location.pathname.replace("/app", "");
  }
  return window.location.pathname;
};

// it handles the domain extraction
export function extractServiceUrl(service: string) {
  const hostname = window.location.hostname;
  
  // Handle community subdomains specifically
  if (hostname === "community.qa.fastn.ai" || hostname.includes("community.qa.fastn.ai")) {
    if (service === "api") {
      return "https://live.fastn.ai/api";
    } else if (service === "auth") {
      return "https://live.fastn.ai/auth";
    } else if (service === "widget") {
      return "https://live.fastn.ai/widget";
    }
  } else if (hostname === "community.live.fastn.ai" || hostname.includes("community.live.fastn.ai")) {
    if (service === "api") {
      return "https://live.fastn.ai/api";
    } else if (service === "auth") {
      return "https://live.fastn.ai/auth";
    } else if (service === "widget") {
      return "https://live.fastn.ai/widget";
    }
  }
  
  const origin = getOrigin();
  if (origin.includes("localhost")) {
    if (service === "widget") {
      return import.meta.env.VITE_APP_WIDGET_URL as string;
    } else if (service === "auth") {
      return import.meta.env.VITE_APP_KEYCLOAK_URL as string;
    } else if (service === "api") {
      return import.meta.env.VITE_APP_GRAPHQL_DOMAIN as string;
    }
  }

  let serviceUrl = origin;

  if (serviceUrl.includes("hotfix.qa.fastn.ai")) {
    serviceUrl = serviceUrl.replace("hotfix.qa.fastn.ai", "hotfix.qa.fastn.ai");
  }

  if (serviceUrl.includes("https://app.fastn.ai")) {
    return serviceUrl.replace("//app.", `//${service}.live.`);
  }

  serviceUrl = serviceUrl
    .replace(/\/\/app\./, `//${service}.`)
    .replace(/\.app\./, `.${service}.`)
    .replace(/\/app/, `/${service}`);

  return serviceUrl;
}

export const getKeyCloakUri = () => {
  const hostname = window.location.hostname;
  
  // Handle community subdomains specifically
  if (hostname === "community.qa.fastn.ai" || hostname.includes("community.qa.fastn.ai")) {
    return "https://live.fastn.ai/auth";
  } else if (hostname === "community.live.fastn.ai" || hostname.includes("community.live.fastn.ai")) {
    return "https://live.fastn.ai/auth";
  }
  
  // Use environment variable for localhost development if available
  if (hostname.includes("localhost")) {
    const envKeycloakUrl = import.meta.env.VITE_APP_KEYCLOAK_URL as string;
    if (envKeycloakUrl) {
      return envKeycloakUrl;
    }
    // Fallback if environment variable is not set
    return "https://live.fastn.ai/auth";
  }
  
  // For other fastn.ai domains, determine auth URL based on subdomain
  if (hostname.includes("qa.fastn.ai")) {
    return "https://qa.fastn.ai/auth";
  } else if (hostname.includes("fastn.ai")) {
    return "https://live.fastn.ai/auth";
  }
  
  return extractServiceUrl(Service.keycloak);
};

export const getWidgetUrl = () => {
  // return "https://dev.fastn.ai/widget";
  return extractServiceUrl(Service.widget);
};

const fastn = [
  "https://dev.fastn.ai/api",
  "https://api.dev.fastn.ai",
  "https://live.fastn.ai/api",
  "https://api.fastn.ai",
  "https://qa.fastn.ai/api",
  "https://api.qa.fastn.ai",
  "http://localhost:8443",
  "https://api.live.fastn.ai",
];

export const getBackendEnpoint = () => {
  return extractServiceUrl(Service.backend);
};

export const isFastnEnv = () => {
  const backend = extractServiceUrl(Service.backend);
  return fastn?.includes(backend);
};

export const getCurrentHost = () => {
  return getBackendEnpoint()
    .replace("https://", "")
    .replace("http://", "")
    .replace("/api", "")
    .replace("api.", "");
};

export const getKeyCloakAuthorityUrl = () => {
  return getKeyCloakUri() + `/realms/${KEYCLOAK_REALM}`;
};

export const getKeyCloakPostLogoutRedirectUri = () => {
  // Use localhost:3000 for development since that's what's configured in Keycloak
  const baseOrigin = window.location.hostname === "localhost" ? "http://localhost:3000" : window.location.origin;
  // Redirect back to the app's login route after logout
  return baseOrigin + AppRoutes.getAuthRoute();
};

export const getFirstPath = () => {
  return window.location.pathname.split("/")?.[1] === "app" ? "/app" : "";
};

export const getBackendGraphqlEndpoint = () => {
  return extractServiceUrl(Service.backend) + "/graphql";
};

export const getKeyCloakRedirectUri = () => {
  const params = new URLSearchParams(window.location.search);
  const returnTo = params.get("return_to");
  
  // Use localhost:3000 for development since that's what's configured in Keycloak
  const baseOrigin = window.location.hostname === "localhost" ? "http://localhost:3000" : window.location.origin;
  let baseUrl = baseOrigin + AppRoutes.getAuthRoute();

  if (getPath() === "/login") {
    baseUrl = baseOrigin + AppRoutes.getAuthRoute();
  } else if (returnTo) {
    baseUrl += `?return_to=${returnTo}`;
  } else {
    baseUrl += `?return_to=${encodeURIComponent(
      window.location.pathname + window.location.search
    )}`;
  }

  return baseUrl;
};

// --------------------- Services URL --------------------- //
export const extractHostAndStateKeyFromStateParam = () => {
  const stateParam =
    new URLSearchParams(window.location.search).get("state") || "";
  const state = stateParam?.split("#");
  const host = state?.[0];
  const stateKey = state?.[1];
  return { host, stateKey };
};

export const getHost = () => {
  // const isLocal =
  //   typeof window !== "undefined" &&
  //   (window.location.hostname === "localhost" ||
  //     window.location.hostname === "127.0.0.1");

  // if (isLocal) {
  //   return "dev.fastn.ai";
  // }

  return getBackendEnpoint()
    .replace("https://", "")
    .replace("http://", "")
    .replace("/api", "")
    .replace("api.", "");
};

export function encodeState(state) {
  const { domain, uuid } = state;
  const encoded = `${domain}#${uuid}`;
  return btoa(encoded);
}

export function textToSnakeCase(text: string) {
  return text
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

export function snakeCaseToTitleCase(text: string) {
  return text
    ?.toLowerCase()
    ?.split("_")
    ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");
}

export function UiCodetoConfigurationFormFields(uiCodeString: string) {
  try {
    const uiCode = JSON.parse(uiCodeString);
    const fields: Record<string, any> = {};

    if (uiCode?.targetType === "object" && typeof uiCode?.target === "object") {
      Object.keys(uiCode.target).forEach(key => {
        const target = uiCode.target[key];
        fields[key] = {
          label: target?.configs?.label || key,
          placeholder: target?.configs?.placeholder,
        };

        if (
          Array.isArray(target?.configs?.selection?.list) &&
          target?.configs?.selection?.list?.length > 0
        ) {
          fields[key].options = target?.configs?.selection?.list?.map(
            (item: any) => ({
              label: item?.label,
              value: item?.value,
            })
          );
        }
      });

      return fields;
    }

    if (uiCode?.targetType === "array" && Array.isArray(uiCode?.target)) {
      const element = uiCode.target[0];
      return UiCodetoConfigurationFormFields(JSON.stringify(element));
    }

    return {};
  } catch (error) {
    return {};
  }
}
