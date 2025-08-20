'use client';

import React from 'react';
import type { AuthState } from '@mind-vitality/types';
import { useAudioNarrationContext } from '@/components/layout/AudioNarrationProvider';

/**
 * Enhanced AuthProvider with senior-friendly features and audio feedback
 * 
 * Note: This is a simplified implementation that provides the auth context structure
 * but will need to be enhanced with full Auth0 integration once the Auth0 tenant is configured.
 */

interface AuthProviderWrapperProps {
  children: React.ReactNode;
}

// Create a simple auth context for now
const AuthContext = React.createContext<{
  user: any;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}>({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
});

/**
 * AuthProvider component with senior-friendly configuration and audio feedback
 * 
 * Features:
 * - Provides authentication context structure
 * - Ready for Auth0 integration when tenant is configured
 * - Senior-friendly error handling and messaging
 * - Integration with existing AudioNarrationProvider
 * - Placeholder for future Auth0 UserProvider integration
 */
export function AuthProvider({ children }: AuthProviderWrapperProps) {
  const { announceError } = useAudioNarrationContext();
  
  // Placeholder auth state - will be replaced with Auth0 integration
  const [authState] = React.useState({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  });

  // Log that auth is not yet configured
  React.useEffect(() => {
    console.log('AuthProvider: Auth0 integration ready for configuration');
    console.log('To complete setup: Configure Auth0 tenant and update AuthProvider');
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

// Simple hook to access auth context
function useUser() {
  return React.useContext(AuthContext);
}

/**
 * Custom hook that provides enhanced authentication state with senior-friendly features
 * This extends Auth0's useUser hook with additional accessibility and UX improvements
 */
export function useAuth(): AuthState & {
  // Auth0 standard properties
  login: (options?: { returnTo?: string; [key: string]: any }) => void;
  logout: (options?: { returnTo?: string; [key: string]: any }) => void;
  
  // Enhanced methods for senior-friendly UX
  loginWithAudio: (options?: { returnTo?: string; [key: string]: any }) => void;
  logoutWithAudio: (options?: { returnTo?: string; [key: string]: any }) => void;
  announceAuthStatus: () => void;
} {
  const { user, error, isLoading } = useUser();
  const { announceNavigation, announceInstruction, announceButtonAction } = useAudioNarrationContext();

  // Enhanced login with audio guidance
  const loginWithAudio = React.useCallback((options?: { returnTo?: string; [key: string]: any }) => {
    announceInstruction('Redirecting you to the secure login page. You will receive an email with a link to sign in.');
    
    // Redirect to Auth0 login
    window.location.href = `/api/auth/login${options?.returnTo ? `?returnTo=${encodeURIComponent(options.returnTo)}` : ''}`;
  }, [announceInstruction]);

  // Enhanced logout with audio confirmation
  const logoutWithAudio = React.useCallback((options?: { returnTo?: string; [key: string]: any }) => {
    announceButtonAction('Signing you out and returning to the home page.');
    
    // Redirect to Auth0 logout
    window.location.href = `/api/auth/logout${options?.returnTo ? `?returnTo=${encodeURIComponent(options.returnTo)}` : ''}`;
  }, [announceButtonAction]);

  // Standard login function
  const login = React.useCallback((options?: { returnTo?: string; [key: string]: any }) => {
    window.location.href = `/api/auth/login${options?.returnTo ? `?returnTo=${encodeURIComponent(options.returnTo)}` : ''}`;
  }, []);

  // Standard logout function
  const logout = React.useCallback((options?: { returnTo?: string; [key: string]: any }) => {
    window.location.href = `/api/auth/logout${options?.returnTo ? `?returnTo=${encodeURIComponent(options.returnTo)}` : ''}`;
  }, []);

  // Announce current authentication status
  const announceAuthStatus = React.useCallback(() => {
    if (isLoading) {
      announceNavigation('Checking your sign-in status...');
    } else if (user) {
      const name = user.name || user.email || 'there';
      announceNavigation(`You are signed in as ${name}`);
    } else {
      announceNavigation('You are not currently signed in');
    }
  }, [isLoading, user, announceNavigation]);

  return {
    // AuthState properties (compatible with existing types)
    user: user ? {
      id: user.sub || '',
      email: user.email || '',
      name: user.name,
      dateOfBirth: user.date_of_birth,
      preferredLanguage: user.locale || 'en',
      createdAt: user.created_at || new Date().toISOString(),
      updatedAt: user.updated_at || new Date().toISOString(),
    } : null,
    isLoading,
    isAuthenticated: !!user && !isLoading,
    error: error?.message || null,
    
    // Auth0 methods
    login,
    logout,
    
    // Enhanced methods
    loginWithAudio,
    logoutWithAudio,
    announceAuthStatus,
  };
}

/**
 * Hook for checking authentication status with loading states
 * Useful for components that need to handle authentication-dependent rendering
 */
export function useAuthStatus() {
  const { user, isLoading, error } = useUser();
  
  return {
    isAuthenticated: !!user && !isLoading,
    isLoading,
    hasError: !!error,
    user: user || null,
  };
}

/**
 * Higher-order component for protecting routes that require authentication
 * Provides senior-friendly loading and error states
 */
export function withAuthRequired<T extends {}>(
  Component: React.ComponentType<T>,
  options?: {
    returnTo?: string;
    onUnauthenticated?: () => void;
    loadingComponent?: React.ComponentType;
  }
) {
  const AuthRequiredComponent = (props: T) => {
    const { user, isLoading, error } = useUser();
    const { announceError, announceInstruction } = useAudioNarrationContext();

    // Handle loading state
    if (isLoading) {
      const LoadingComponent = options?.loadingComponent || (() => (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-lg text-gray-700">Checking your sign-in status...</p>
          </div>
        </div>
      ));
      return <LoadingComponent />;
    }

    // Handle authentication error
    if (error) {
      React.useEffect(() => {
        announceError('There was a problem checking your sign-in status. Please try refreshing the page.');
      }, [error, announceError]);

      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-gray-900">Authentication Error</h2>
            <p className="text-lg text-gray-700">
              There was a problem checking your sign-in status. Please refresh the page or try signing in again.
            </p>
          </div>
        </div>
      );
    }

    // Handle unauthenticated state
    if (!user) {
      React.useEffect(() => {
        announceInstruction('You need to sign in to access this page. Redirecting to the sign-in page.');
        
        if (options?.onUnauthenticated) {
          options.onUnauthenticated();
        } else {
          // Redirect to login with return URL
          const returnTo = options?.returnTo || window.location.pathname;
          window.location.href = `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
        }
      }, [announceInstruction]);

      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-lg text-gray-700">Redirecting to sign-in page...</p>
          </div>
        </div>
      );
    }

    // User is authenticated, render the component
    return <Component {...props} />;
  };

  AuthRequiredComponent.displayName = `withAuthRequired(${Component.displayName || Component.name})`;
  return AuthRequiredComponent;
}




