import { Spinner } from "@/components/utils-components/spinner";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notify } from "@/components/toaster/toaster";
import {
  clearCustomAuthConfigFromCookie,
  // extractHostAndStateKeyFromStateParam,
  getBackendEnpoint,
  getHost,
} from "@/utils/misc";
import { getUser } from "@/services/users/user-manager";
import { CUSTOM_AUTH_KEY } from "@/constants";
import { signIn } from "@/services/users/user-manager";
import { AppRoutes } from "@/utils/config";
import {
  ActivateConnectorInfo,
  useActivateConnectorInfo,
} from "@/context/oauth-redirect-api-info";

export const getCookie = cookieName => {
  const cookiesArray = document.cookie.split(";").map(item => item.trim());
  const targetCookie = cookiesArray.find(item =>
    item.startsWith(`${cookieName}=`)
  );

  if (!targetCookie) return null;

  const value = targetCookie.split("=")[1];
  return value ? decodeURIComponent(value) : null;
};

export const oauthPageLoader = async () => {
  const user = getUser();
  const isCustomAuthEnabled = getCookie(CUSTOM_AUTH_KEY) === "true";

  if (!user && !Boolean(isCustomAuthEnabled)) {
    throw await signIn();
  }

  return { user };
};

const getParams = (paramsString = window.location.search) => {
  try {
    const searchParams = new URLSearchParams(paramsString);
    const params = {} as any;
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  } catch (error) {
    return {};
  }
};

const activateConnector = async (
  state: any,
  activateConnectorRedirectInfo: ActivateConnectorInfo
) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(state?.header || {}),
    };

    if (activateConnectorRedirectInfo?.redirect_api?.headers) {
      activateConnectorRedirectInfo?.redirect_api?.headers.forEach(
        (header: any) => {
          headers[header.key] = header?.value;
        }
      );
    }

    const response = await fetch(
      getBackendEnpoint() + activateConnectorRedirectInfo?.redirect_api?.url,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          input: {
            fastn_connection: {
              projectId: state.projectId,
              domain: getHost(),
              redirectUri: activateConnectorRedirectInfo?.redirect_uri,
            },
            oauth: {
              connector: state.connector || {},
              response: getParams(state.params),
            },
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to activate connector");
    }

    notify.success("Connector activated successfully.");
    
    // Note: OAuth activation from login/oauth.tsx does not automatically insert tools
    // Tool insertion only happens when OAuth is triggered from Step2 onboarding flow
    console.log('OAuth connector activated successfully, but skipping automatic tool insertion');
    
    return;
  } catch (error) {
    throw error;
  }
};

const ConnectorActivateRedirectHandler = () => {
  const [state, setState] = useState<any>(null);
  const [status, setStatus] = useState(
    "idle" as "idle" | "loading" | "success" | "error"
  );
  const [, setError] = useState<any>(null);
  const navigate = useNavigate();
  const isRunning = useRef(false);
  const activateConnectorInfo = useActivateConnectorInfo();

  const handleActivateConnector = async (state: any) => {
    try {
      await activateConnector(
        {
          projectId: state?.projectId,
          header: state?.header,
          group: state?.connector,
          authToken: state?.authToken,
        },
        activateConnectorInfo
      );
      setStatus("success");
    } catch (error: any) {
      notify.error("Failed to activate connector");
      setStatus("error");
      setError(error?.message || "Failed to activate connector");
    }
  };

  useEffect(() => {
    if (isRunning.current) return;
    isRunning.current = true;

    async function fetchState() {
      // const { stateKey } = extractHostAndStateKeyFromStateParam();
      const stateKey = getParams().state;
      if (!stateKey || stateKey === "none") {
        return null;
      }
      const response = await fetch(
        getBackendEnpoint() +
          `/control/widget-connector/activation-state/${stateKey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response?.ok) {
        throw new Error("Failed to get state");
      }

      const data = await response?.json();
      return data;
    }

    fetchState()
      .then(connectorState => {
        let state = null as any;
        if (connectorState) {
          state = connectorState?.value;
        } else {
          state = localStorage.getItem("activate_connector_state");
          state = JSON.parse(state);
        }
        if (!state) throw new Error("State not found, It might be expired");
        if (!state?.projectId)
          throw new Error("Invalid state: workspace id not found");
        setState(state);

        setState(state);
        setStatus("loading");
      })
      .catch(error => {
        notify.error("Failed to get state");
        setStatus("error");
        setError(error?.message || "Failed to get state");
      });
  }, []);

  useEffect(() => {
    if (status !== "loading") return;
    if (state) {
      handleActivateConnector(state);
    }
  }, [status]);

  if (status === "error") {
    if (!state?.currentPath) {
      navigate(AppRoutes.getBaseRoute());
    } else if (state?.currentPath?.includes(document.location.host)) {
      navigate(state?.currentPath + "/" + state?.connectorId);
    } else {
      window.location.href = state?.currentPath;
    }
  }

  if (status === "idle") {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-4 relative">
        <Spinner size="lg" center={false} />
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-4 relative">
        <Spinner size="lg" center={false} />
        <p className="text-gray-900 text-lg font-medium">
          Please wait while we activate the connector...
        </p>
      </div>
    );
  }

  if (status === "success" || status === "error") {
    clearCustomAuthConfigFromCookie();
    if (!state?.currentPath && !state?.currentOrigin) {
      navigate(AppRoutes.getBaseRoute());
    } else if (
      state?.currentOrigin?.includes(document.location.host) ||
      state?.currentPath?.includes(document.location.host)
    ) {
      if (state?.connectorId) {
        navigate(state?.currentPath + "/" + state?.connectorId);
      } else {
        window.location.href = state?.currentPath;
      }
    } else {
      window.location.href =
        (state?.currentOrigin || "") +
        (state?.currentPath
          ? state?.currentPath?.includes("/")
            ? state?.currentPath
            : "/" + state?.currentPath
          : "");
    }
  }
};

export { activateConnector, ConnectorActivateRedirectHandler };
