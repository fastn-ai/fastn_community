import { User, UserManager } from "oidc-client-ts";
import {
  getKeyCloakAuthorityUrl,
  getKeyCloakRedirectUri,
  getKeyCloakPostLogoutRedirectUri,
} from "@/utils/misc";
import { notify } from "@/components/toaster/toaster";
import { KEYCLOAK_CLIENT_ID, USER_SIGN_IN_FLAG_NAME } from "@/constants";

const keycloakConfig = {
  authority: getKeyCloakAuthorityUrl(),
  client_id: KEYCLOAK_CLIENT_ID,
  redirect_uri: getKeyCloakRedirectUri(),
  // Remove post_logout_redirect_uri to avoid redirect URI errors
  response_type: "code",
  scope: "openid profile email",
  automaticSilentRenew: true,
  includeIdTokenInSilentRenew: true,
  loadUserInfo: true,
};

export const userManager = new UserManager(keycloakConfig);

export const oidcSettings = {
  userManager,
};

export function getUser() {
  const authority = getKeyCloakAuthorityUrl();
  const clientId = KEYCLOAK_CLIENT_ID;
  const oidcStorage = sessionStorage.getItem(
    `oidc.user:${authority}:${clientId}`
  );
  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage);
}

export async function refreshToken() {
  try {
    await userManager.signinSilent();
    return;
  } catch (error) {
    userManager.signoutRedirect();
    sessionStorage.clear();
  }
}

export function loadUser() {
  return userManager.getUser();
}

export function signOut() {
  // Clear local session immediately
  localStorage.clear();
  sessionStorage.clear();

  // Redirect to home page immediately
  window.location.href = '/';

  userManager.signoutRedirect();
  return Promise.resolve();
}

export async function signIn() {
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 500; // optional: add delay between retries

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await userManager.signinRedirect();
    } catch (error: any) {
      if (attempt === MAX_RETRIES) {
        throw new Error(
          "Couldn't connect to the auth server at the moment. Please try again later."
        );
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

export function signinSilent() {
  return userManager.signinSilent();
}

export function handleAuthErrorFromBackend() {
  try {
    userManager.signinRedirectCallback();
  } catch (error) {
    userManager.signoutRedirect();
  }
}

export async function handleAuthError(): Promise<void> {
  try {
    await userManager.signinSilent();
  } catch (error) {
    notify.error("Your session has expired. Please log in again.");
    userManager.signoutRedirect();
    sessionStorage.clear();
  }
}

let isSignInSilentInProgress = false;

async function waitForSilentSignInToComplete() {
  while (isSignInSilentInProgress) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

export async function handleAuthErrorWithCheck() {
  if (isSignInSilentInProgress) {
    await waitForSilentSignInToComplete();
    return;
  }
  isSignInSilentInProgress = true;
  try {
    await userManager.signinSilent();
  } catch (error) {
    notify.error("Your session has expired. Please log in again.");
    await userManager.signinRedirect();
  } finally {
    isSignInSilentInProgress = false;
  }
}
