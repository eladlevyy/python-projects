'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@mind-vitality/utils';
import type { AppError, ErrorSeverity } from '@mind-vitality/types';
import { Button } from './Button';

/**
 * ErrorMessage component variants using class-variance-authority
 * Senior-friendly error display with accessibility features
 */
const errorMessageVariants = cva(
  [
    // Base styles for error containers
    'rounded-2xl border-2 p-6',
    'bg-white shadow-accessible',
    'max-w-2xl mx-auto',
    // Ensure readable text size for seniors
    'text-lg leading-relaxed',
  ],
  {
    variants: {
      severity: {
        low: [
          'border-yellow-300 bg-yellow-50',
          'text-yellow-800',
        ],
        medium: [
          'border-orange-300 bg-orange-50',
          'text-orange-800',
        ],
        high: [
          'border-red-300 bg-red-50',
          'text-red-800',
        ],
        critical: [
          'border-red-500 bg-red-100',
          'text-red-900',
          'ring-2 ring-red-200',
        ],
      },
    },
    defaultVariants: {
      severity: 'medium',
    },
  }
);

/**
 * Icon variants for different error severities
 */
const errorIconVariants = cva(
  [
    // Base icon styles
    'w-12 h-12 mb-4 mx-auto',
    'rounded-full flex items-center justify-center',
    'text-2xl font-bold',
  ],
  {
    variants: {
      severity: {
        low: [
          'bg-yellow-200 text-yellow-700',
        ],
        medium: [
          'bg-orange-200 text-orange-700',
        ],
        high: [
          'bg-red-200 text-red-700',
        ],
        critical: [
          'bg-red-300 text-red-800',
          'ring-2 ring-red-400',
        ],
      },
    },
    defaultVariants: {
      severity: 'medium',
    },
  }
);

/**
 * Props for ErrorMessage component
 */
interface ErrorMessageProps extends VariantProps<typeof errorMessageVariants> {
  error: AppError;
  onRetry?: () => void;
  onDismiss?: () => void;
  onContactSupport?: () => void;
  className?: string;
  retryLabel?: string;
  dismissLabel?: string;
  supportLabel?: string;
  showTimestamp?: boolean;
  announceError?: (message: string) => void;
  announceRetry?: (message: string) => void;
  announceSuccess?: (message: string) => void;
}

/**
 * ErrorMessage component with senior-friendly design and audio feedback
 * 
 * Features:
 * - WCAG 2.2 AA compliant error display
 * - High contrast colors and clear visual indicators
 * - Large tap targets for all interactive elements (≥44px)
 * - Audio narration integration for error announcements
 * - Senior-friendly language and instructions
 * - Proper ARIA live regions for screen reader announcements
 * - Multiple severity levels with appropriate visual treatment
 * - Retry and support contact options
 */
export function ErrorMessage({
  error,
  severity,
  onRetry,
  onDismiss,
  onContactSupport,
  className,
  retryLabel = 'Try Again',
  dismissLabel = 'Dismiss',
  supportLabel = 'Contact Support',
  showTimestamp = false,
  announceError,
  announceRetry,
  announceSuccess,
  ...props
}: ErrorMessageProps) {
  const [isRetrying, setIsRetrying] = React.useState(false);
  const [isDismissed, setIsDismissed] = React.useState(false);
  
  // Determine severity based on error code if not provided
  const determinedSeverity = severity || getSeverityFromError(error);

  // Announce error when component mounts
  React.useEffect(() => {
    if (announceError && !isDismissed) {
      const announcement = `${getSeverityLabel(determinedSeverity)} error: ${error.userMessage}`;
      announceError(announcement);
    }
  }, [error.userMessage, determinedSeverity, announceError, isDismissed]);

  // Handle retry action
  const handleRetry = React.useCallback(async () => {
    if (!onRetry || isRetrying) return;

    setIsRetrying(true);
    
    try {
      if (announceRetry) {
        announceRetry('Retrying the action. Please wait...');
      }
      
      await onRetry();
      
      if (announceSuccess) {
        announceSuccess('Action completed successfully');
      }
    } catch (retryError) {
      if (announceError) {
        announceError('Retry failed. Please try again or contact support.');
      }
    } finally {
      setIsRetrying(false);
    }
  }, [onRetry, isRetrying, announceRetry, announceSuccess, announceError]);

  // Handle dismiss action
  const handleDismiss = React.useCallback(() => {
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
    if (announceSuccess) {
      announceSuccess('Error message dismissed');
    }
  }, [onDismiss, announceSuccess]);

  // Handle contact support
  const handleContactSupport = React.useCallback(() => {
    if (onContactSupport) {
      onContactSupport();
    }
    if (announceRetry) {
      announceRetry('Opening support contact options');
    }
  }, [onContactSupport, announceRetry]);

  // Don't render if dismissed
  if (isDismissed) {
    return null;
  }

  return (
    <div
      className={cn(errorMessageVariants({ severity: determinedSeverity }), className)}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      {...props}
    >
      {/* Error Icon */}
      <div 
        className={cn(errorIconVariants({ severity: determinedSeverity }))}
        aria-hidden="true"
      >
        {getErrorIcon(determinedSeverity)}
      </div>

      {/* Error Title */}
      <h2 className="text-2xl font-semibold text-center mb-4">
        {getErrorTitle(determinedSeverity)}
      </h2>

      {/* Error Message */}
      <div className="text-center mb-6 space-y-3">
        <p className="font-medium">
          {error.userMessage}
        </p>

        {/* Additional context if available */}
        {error.context?.userHint && (
          <p className="text-base opacity-80">
            {error.context.userHint}
          </p>
        )}

        {/* Timestamp if requested */}
        {showTimestamp && (
          <p className="text-sm opacity-60">
            Occurred at {new Date(error.timestamp).toLocaleString()}
          </p>
        )}

        {/* Error code for technical support */}
        <details className="text-sm opacity-60 cursor-pointer">
          <summary className="hover:opacity-80 transition-opacity">
            Technical Details (for support)
          </summary>
          <pre className="mt-2 text-left bg-gray-100 p-3 rounded-lg overflow-auto">
            {JSON.stringify({ 
              code: error.code, 
              message: error.message,
              timestamp: error.timestamp 
            }, null, 2)}
          </pre>
        </details>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {/* Retry button */}
        {onRetry && (
          <Button
            variant="primary"
            size="lg"
            onClick={handleRetry}
            loading={isRetrying}
            disabled={isRetrying}
            onAudioNarrate={announceRetry}
            aria-describedby="retry-description"
            className="min-w-[200px]"
          >
            {isRetrying ? 'Retrying...' : retryLabel}
          </Button>
        )}

        {/* Contact Support button */}
        {onContactSupport && (
          <Button
            variant="outline"
            size="lg"
            onClick={handleContactSupport}
            onAudioNarrate={announceRetry}
            aria-describedby="support-description"
            className="min-w-[200px]"
          >
            {supportLabel}
          </Button>
        )}

        {/* Dismiss button */}
        {onDismiss && (
          <Button
            variant="ghost"
            size="md"
            onClick={handleDismiss}
            onAudioNarrate={announceSuccess}
            aria-describedby="dismiss-description"
          >
            {dismissLabel}
          </Button>
        )}
      </div>

      {/* Hidden descriptions for screen readers */}
      <div className="sr-only">
        <div id="retry-description">
          Retry the action that caused this error
        </div>
        <div id="support-description">
          Get help from our support team with this issue
        </div>
        <div id="dismiss-description">
          Close this error message and continue
        </div>
      </div>
    </div>
  );
}

/**
 * Determine error severity from error code/message
 */
function getSeverityFromError(error: AppError): ErrorSeverity {
  const code = error.code.toLowerCase();
  const message = error.message.toLowerCase();

  // Critical errors
  if (code.includes('fatal') || code.includes('critical') || code.includes('system')) {
    return 'critical';
  }

  // High severity errors
  if (code.includes('auth') || code.includes('permission') || code.includes('security')) {
    return 'high';
  }

  // Low severity errors
  if (code.includes('warning') || message.includes('timeout') || code.includes('network')) {
    return 'low';
  }

  // Default to medium
  return 'medium';
}

/**
 * Get appropriate icon for error severity
 */
function getErrorIcon(severity: ErrorSeverity): string {
  switch (severity) {
    case 'low':
      return '⚠️';
    case 'medium':
      return '⚠️';
    case 'high':
      return '❌';
    case 'critical':
      return '🚨';
    default:
      return '⚠️';
  }
}

/**
 * Get appropriate title for error severity
 */
function getErrorTitle(severity: ErrorSeverity): string {
  switch (severity) {
    case 'low':
      return 'Small Issue Detected';
    case 'medium':
      return 'Something Went Wrong';
    case 'high':
      return 'Important Issue';
    case 'critical':
      return 'Critical Error';
    default:
      return 'Something Went Wrong';
  }
}

/**
 * Get severity label for screen readers
 */
function getSeverityLabel(severity: ErrorSeverity): string {
  switch (severity) {
    case 'low':
      return 'Low priority';
    case 'medium':
      return 'Medium priority';
    case 'high':
      return 'High priority';
    case 'critical':
      return 'Critical';
    default:
      return 'Medium priority';
  }
}

/**
 * Simple error message component for inline use
 */
export function InlineErrorMessage({ 
  message, 
  className,
  onAudioNarrate 
}: { 
  message: string; 
  className?: string;
  onAudioNarrate?: (message: string) => void;
}) {
  React.useEffect(() => {
    if (onAudioNarrate && message) {
      onAudioNarrate(`Error: ${message}`);
    }
  }, [message, onAudioNarrate]);

  return (
    <div 
      className={cn(
        'flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-base',
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <span aria-hidden="true">⚠️</span>
      <span>{message}</span>
    </div>
  );
}

// Export variants for external use
export { errorMessageVariants, errorIconVariants };
