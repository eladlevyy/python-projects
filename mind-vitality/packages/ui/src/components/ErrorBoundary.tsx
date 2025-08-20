'use client';

import * as React from 'react';
import type { AppError, ErrorBoundaryState } from '@mind-vitality/types';
import { ErrorMessage } from './ErrorMessage';

/**
 * Props for ErrorBoundary component
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: AppError) => React.ReactNode;
  onError?: (error: AppError, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
  className?: string;
  showRetry?: boolean;
  retryLabel?: string;
  announceError?: (error: string) => void;
}

/**
 * ErrorBoundary component with senior-friendly design and audio feedback
 * 
 * Features:
 * - WCAG 2.2 AA compliant error handling
 * - Audio narration support for error announcements
 * - Senior-friendly error messages and UI
 * - Large tap targets for retry actions
 * - High contrast visual indicators
 * - Proper ARIA live regions for screen readers
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render shows the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error for monitoring/debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Create AppError object for consistent error handling
    const appError: AppError = {
      code: error.name || 'UNKNOWN_ERROR',
      message: error.message,
      userMessage: this.getSeniorFriendlyMessage(error),
      timestamp: new Date().toISOString(),
      context: {
        componentStack: errorInfo.componentStack,
        errorBoundary: 'ErrorBoundary',
      },
    };

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(appError, errorInfo);
    }

    // Announce error via audio narration
    if (this.props.announceError) {
      this.props.announceError(`Error occurred: ${appError.userMessage}`);
    }

    // Auto-retry after 5 seconds for certain errors
    if (this.shouldAutoRetry(error)) {
      this.resetTimeoutId = window.setTimeout(() => {
        this.handleReset();
      }, 5000);
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  /**
   * Generate senior-friendly error messages
   */
  private getSeniorFriendlyMessage(error: Error): string {
    const errorName = error.name?.toLowerCase() || '';
    const errorMessage = error.message?.toLowerCase() || '';

    // Network-related errors
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return 'There seems to be a problem with your internet connection. Please check your connection and try again.';
    }

    // Authentication errors
    if (errorMessage.includes('auth') || errorMessage.includes('login')) {
      return 'You may need to sign in again. Please try logging in to continue.';
    }

    // Timeout errors
    if (errorMessage.includes('timeout')) {
      return 'The request is taking longer than usual. Please wait a moment and try again.';
    }

    // Permission errors
    if (errorMessage.includes('permission') || errorMessage.includes('forbidden')) {
      return 'You don\'t have permission to access this feature. Please contact support if you need help.';
    }

    // Generic fallback message
    return 'Something unexpected happened. Don\'t worry, you can try again or contact our support team for help.';
  }

  /**
   * Determine if error should auto-retry
   */
  private shouldAutoRetry(error: Error): boolean {
    const errorMessage = error.message?.toLowerCase() || '';
    
    // Auto-retry for network or timeout errors
    return errorMessage.includes('network') || 
           errorMessage.includes('timeout') || 
           errorMessage.includes('fetch');
  }

  /**
   * Handle error boundary reset
   */
  private handleReset = (): void => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call onReset callback if provided
    if (this.props.onReset) {
      this.props.onReset();
    }

    // Announce recovery via audio narration
    if (this.props.announceError) {
      this.props.announceError('Error resolved. Returning to the previous screen.');
    }
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const appError: AppError = {
        code: this.state.error.name || 'UNKNOWN_ERROR',
        message: this.state.error.message,
        userMessage: this.getSeniorFriendlyMessage(this.state.error),
        timestamp: new Date().toISOString(),
        context: {
          componentStack: this.state.errorInfo?.componentStack,
          errorBoundary: 'ErrorBoundary',
        },
      };

      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(appError);
      }

      // Default error UI
      return (
        <div 
          className={`error-boundary ${this.props.className || ''}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <ErrorMessage
            error={appError}
            onRetry={this.props.showRetry !== false ? this.handleReset : undefined}
            retryLabel={this.props.retryLabel}
            announceError={this.props.announceError}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook version of ErrorBoundary for functional components
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return {
    captureError,
    resetError,
  };
}

/**
 * HOC version of ErrorBoundary
 */
export function withErrorBoundary<T extends {}>(
  Component: React.ComponentType<T>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: T) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
