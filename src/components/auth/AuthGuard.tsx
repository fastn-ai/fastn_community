import React from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, LogIn, ArrowLeft } from 'lucide-react';
import { useUserRole } from '@/context/UserRoleContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  fallbackComponent?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  fallbackComponent
}) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { isAdmin, isLoading: isLoadingRole } = useUserRole();
  
  // Check if user is authenticated
  const isAuthenticated = auth.isAuthenticated && auth.user;

  // Show loading state while authentication is being determined
  if (auth.isLoading || (requireAdmin && isLoadingRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="mt-4 text-2xl font-bold text-gray-900">
                Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  You need to be logged in to access this page. Please sign in to continue.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Go Back</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="mt-4 text-2xl font-bold text-gray-900">
                Access Restricted
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  This page is restricted to administrators only.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                {!isAuthenticated ? (
                  <Button
                    onClick={() => navigate('/login')}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Go to Home</span>
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Go Back</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default AuthGuard;
