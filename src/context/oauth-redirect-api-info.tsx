import React, { createContext, useContext, ReactNode } from 'react';

export interface ActivateConnectorInfo {
  redirect_api?: {
    url: string;
    headers?: Array<{
      key: string;
      value: string;
    }>;
  };
  redirect_uri?: string;
}

interface OAuthRedirectApiInfoContextType {
  activateConnectorInfo: ActivateConnectorInfo | null;
  setActivateConnectorInfo: (info: ActivateConnectorInfo | null) => void;
}

const OAuthRedirectApiInfoContext = createContext<OAuthRedirectApiInfoContextType | undefined>(undefined);

export const useActivateConnectorInfo = () => {
  const context = useContext(OAuthRedirectApiInfoContext);
  if (!context) {
    throw new Error('useActivateConnectorInfo must be used within an OAuthRedirectApiInfoProvider');
  }
  return context.activateConnectorInfo;
};

interface OAuthRedirectApiInfoProviderProps {
  children: ReactNode;
}

export const OAuthRedirectApiInfoProvider: React.FC<OAuthRedirectApiInfoProviderProps> = ({ children }) => {
  const [activateConnectorInfo, setActivateConnectorInfo] = React.useState<ActivateConnectorInfo | null>(null);

  return (
    <OAuthRedirectApiInfoContext.Provider value={{ activateConnectorInfo, setActivateConnectorInfo }}>
      {children}
    </OAuthRedirectApiInfoContext.Provider>
  );
};
