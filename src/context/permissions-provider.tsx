import React, { createContext, useContext, ReactNode } from 'react';

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

interface PermissionsContextType {
  permissions: Permission[];
  hasPermission: (resource: string, action: string) => boolean;
  setPermissions: (permissions: Permission[]) => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

interface PermissionsProviderProps {
  children: ReactNode;
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
  const [permissions, setPermissions] = React.useState<Permission[]>([]);

  const hasPermission = React.useCallback((resource: string, action: string) => {
    return permissions.some(
      permission => permission.resource === resource && permission.action === action
    );
  }, [permissions]);

  return (
    <PermissionsContext.Provider value={{ permissions, hasPermission, setPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};

// JWT decode function
export const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};
