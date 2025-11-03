import { Spinner } from "@/components/utils-components/spinner";
import { getUser, signIn } from "@/services/users/user-manager";
import { insertUser, InsertUserPayload } from "@/services/api";
import { AppRoutes } from "@/utils/config";
import React from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

export const loader = async ({ request }) => {
  const searchParams = new URLSearchParams(request.url);
  const sessionState = searchParams.get("session_state");

  if (!sessionState) {
    localStorage.setItem("user_is_not_logged_in", JSON.stringify(true));
    throw await signIn();
  }

  const user = getUser();
  localStorage.setItem("logged_in_user_email", user?.profile?.email || "");

  return null;
};

export function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const returnTo = searchParams.get("return_to");
  const sessionState = searchParams.get("session_state");

  React.useEffect(() => {
    // Handle OAuth callback
    if (sessionState) {
      const user = getUser();
      if (user) {
        localStorage.setItem("logged_in_user_email", user?.profile?.email || "");
        const authToken = user?.access_token || "";
        try {
          const payload: InsertUserPayload = {
            action: "insertUser",
            data: {
              id: user?.profile?.sub || user?.profile?.sid || user?.profile?.email,
              username: user?.profile?.preferred_username || user?.profile?.email?.split("@")[0] || "user",
              email: user?.profile?.email || "",
              avatar: user?.profile?.picture || "",
              bio: "",
              location: user?.profile?.locale || "",
              website: "",
              twitter: "",
              github: "",
              linkedin: "",
              role_id: 2,
              is_verified: true,
              is_active: true,
              last_login: new Date().toISOString(),
              created_at: undefined,
              updated_at: new Date().toISOString(),
            },
          };
          // Fire and forget; avoid blocking navigation
          insertUser(payload, authToken).catch(console.warn);
        } catch (e) {
          console.warn("insertUser error", e);
        }
        if (returnTo) {
          navigate(returnTo);
        } else {
          navigate(AppRoutes.getBaseRoute());
        }
      }
    } else {
      // No session state, initiate login
      console.log("No session state, initiating Keycloak login...");
      localStorage.setItem("user_is_not_logged_in", JSON.stringify(true));
      
      signIn().catch((error) => {
        console.error("Sign in failed:", error);
        // If Keycloak fails, show error
        console.log("Keycloak authentication failed:", error.message);
      });
    }
  }, [sessionState, returnTo, navigate]);

  React.useEffect(() => {
    // Handle auth state changes
    if (auth.isAuthenticated && !auth.isLoading && !auth.error && !auth.activeNavigator) {
      const insertedFlagKey = "crud_user_insert_done";
      const alreadyInserted = localStorage.getItem(insertedFlagKey);
      if (!alreadyInserted) {
        const user = getUser() || (auth.user as any);
        const authToken = (user && (user.access_token || user?.access_token)) || "";
        if (authToken) {
          try {
            const payload: InsertUserPayload = {
              action: "insertUser",
              data: {
                id: user?.profile?.sub || user?.profile?.sid || user?.profile?.email,
                username:
                  user?.profile?.preferred_username ||
                  user?.profile?.email?.split("@")[0] ||
                  "user",
                email: user?.profile?.email || "",
                avatar: user?.profile?.picture || "",
                bio: "",
                location: user?.profile?.locale || "",
                website: "",
                twitter: "",
                github: "",
                linkedin: "",
                role_id: 2,
                is_verified: true,
                is_active: true,
                last_login: new Date().toISOString(),
                created_at: undefined,
                updated_at: new Date().toISOString(),
              },
            };
            insertUser(payload, authToken)
              .then(() => localStorage.setItem(insertedFlagKey, "1"))
              .catch(console.warn);
          } catch (e) {
            console.warn("insertUser error", e);
          }
        }
      }
      if (returnTo) {
        navigate(returnTo);
      } else {
        navigate(AppRoutes.getBaseRoute());
      }
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.error, auth.activeNavigator, returnTo, navigate]);

  if (auth.error) {
    console.error("Auth error:", auth.error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{auth.error.message}</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
            <button
              onClick={() => navigate(AppRoutes.getBaseRoute())}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Continue Without Auth
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" center={false} />
        <p className="mt-4 text-gray-600">
          {sessionState ? "Processing authentication..." : "Redirecting to Keycloak authentication..."}
        </p>
        {!sessionState && (
          <p className="mt-2 text-sm text-gray-500">
            If you're not redirected automatically, please wait a moment...
          </p>
        )}
      </div>
    </div>
  );
}