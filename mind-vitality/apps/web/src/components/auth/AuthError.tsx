'use client';

import React from 'react';
import { Button } from '@mind-vitality/ui';
import { SingleActionLayout } from '@/components/layout/SingleActionLayout';
import { useAuth } from './AuthProvider';
import { useAudioNarrationContext } from '@/components/layout/AudioNarrationProvider';

export interface AuthErrorProps {
  error: string | Error;
  errorCode?: string;
  userEmail?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  onContactSupport?: () => void;
  showRetryButton?: boolean;
  showBackButton?: boolean;
  showSupportButton?: boolean;
  maxRetryAttempts?: number;
  currentAttempt?: number;
}

/**
 * Senior-friendly authentication error component with clear retry options
 * 
 * Features:
 * - Clear, non-technical error messages tailored for seniors
 * - Multiple recovery options with large, accessible buttons
 * - Audio announcements of errors and available actions
 * - Contextual help based on error type
 * - Integration with SingleActionLayout pattern
 * - High contrast visual indicators
 * - Keyboard navigation support
 * - Progressive disclosure of technical details
 * - Direct support contact options
 */
export function AuthError({ 
  error,
  errorCode,
  userEmail,
  onRetry,
  onGoBack,
  onContactSupport,
  showRetryButton = true,
  showBackButton = true,
  showSupportButton = true,
  maxRetryAttempts = 3,
  currentAttempt = 1
}: AuthErrorProps) {
  const [showTechnicalDetails, setShowTechnicalDetails] = React.useState(false);
  const [hasAnnouncedError, setHasAnnouncedError] = React.useState(false);
  
  const { loginWithAudio } = useAuth();
  const { 
    announceError, 
    announceButtonAction,
    announceNavigation,
    announceInstruction
  } = useAudioNarrationContext();

  // Extract error information
  const errorMessage = error instanceof Error ? error.message : error;
  const canRetry = currentAttempt < maxRetryAttempts && showRetryButton;
  
  // Generate user-friendly error messages
  const getFriendlyErrorMessage = (error: string, code?: string): {
    title: string;
    description: string;
    suggestions: string[];
  } => {
    const lowerError = error.toLowerCase();
    
    if (lowerError.includes('network') || lowerError.includes('connection')) {
      return {
        title: 'Connection Problem',
        description: 'We\'re having trouble connecting to our servers.',
        suggestions: [
          'Check your internet connection',
          'Try again in a few moments',
          'Make sure you\'re connected to Wi-Fi or mobile data'
        ]
      };
    }
    
    if (lowerError.includes('invalid') || lowerError.includes('unauthorized') || lowerError.includes('wrong')) {
      return {
        title: 'Sign-In Information Issue',
        description: 'There was a problem with your sign-in information.',
        suggestions: [
          'Double-check your email address',
          'Make sure you clicked the correct link from your email',
          'Try requesting a new sign-in link'
        ]
      };
    }
    
    if (lowerError.includes('expired') || lowerError.includes('timeout')) {
      return {
        title: 'Link Has Expired',
        description: 'Your sign-in link or verification code has expired.',
        suggestions: [
          'Request a new sign-in link',
          'Check your email for the most recent message',
          'Make sure to use the link within 15 minutes'
        ]
      };
    }
    
    if (lowerError.includes('blocked') || lowerError.includes('suspended')) {
      return {
        title: 'Account Access Issue',
        description: 'There\'s an issue with your account access.',
        suggestions: [
          'Contact our support team directly',
          'We\'ll help resolve this quickly',
          'Have your email address ready when you call'
        ]
      };
    }
    
    if (lowerError.includes('rate') || lowerError.includes('many') || lowerError.includes('attempts')) {
      return {
        title: 'Too Many Attempts',
        description: 'You\'ve tried to sign in too many times.',
        suggestions: [
          'Wait a few minutes before trying again',
          'Try using a different device or browser',
          'Contact support if the problem continues'
        ]
      };
    }
    
    // Generic error fallback
    return {
      title: 'Sign-In Problem',
      description: 'We encountered an issue while trying to sign you in.',
      suggestions: [
        'Try the sign-in process again',
        'Check your internet connection',
        'Contact our support team if the problem continues'
      ]
    };
  };

  const errorInfo = getFriendlyErrorMessage(errorMessage, errorCode);

  // Announce error when component mounts
  React.useEffect(() => {
    if (!hasAnnouncedError) {
      announceError(`${errorInfo.title}. ${errorInfo.description}`);
      
      if (canRetry) {
        announceInstruction('You can try again or go back to start over.');
      } else if (showSupportButton) {
        announceInstruction('Please contact our support team for assistance.');
      }
      
      setHasAnnouncedError(true);
    }
  }, [announceError, announceInstruction, errorInfo, canRetry, showSupportButton, hasAnnouncedError]);

  // Handle retry action
  const handleRetry = () => {
    announceButtonAction('Trying to sign in again');
    onRetry?.();
  };

  // Handle going back
  const handleGoBack = () => {
    announceNavigation('Going back to start over');
    onGoBack?.();
  };

  // Handle starting new sign-in process
  const handleStartOver = () => {
    announceNavigation('Starting the sign-in process over');
    loginWithAudio();
  };

  // Handle contact support
  const handleContactSupport = () => {
    announceButtonAction('Opening email to contact our support team');
    
    if (onContactSupport) {
      onContactSupport();
    } else {
      // Default support action
      const subject = encodeURIComponent(`Sign-In Help - ${errorInfo.title}`);
      const body = encodeURIComponent(
        `Hello Mind Vitality Support Team,

I need help with signing in to my account.

Problem: ${errorInfo.title}
${userEmail ? `Email: ${userEmail}` : ''}
${errorCode ? `Error Code: ${errorCode}` : ''}

Please help me resolve this issue.

Thank you!`
      );
      
      window.open(`mailto:support@mindvitality.com?subject=${subject}&body=${body}`, '_blank');
    }
  };

  // Handle showing technical details
  const handleToggleTechnicalDetails = () => {
    setShowTechnicalDetails(!showTechnicalDetails);
    if (!showTechnicalDetails) {
      announceInstruction('Technical details expanded');
    } else {
      announceInstruction('Technical details collapsed');
    }
  };

  return (
    <SingleActionLayout
      title={errorInfo.title}
      subtitle="Don't worry, we can help you get signed in"
      steps={[
        { id: 'error', title: 'Sign-In Error', status: 'error' }
      ]}
      currentStepId="error"
      showProgress={false}
      className="text-center"
    >
      <div className="w-full max-w-md space-y-8">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
        </div>

        {/* Error Description */}
        <div className="space-y-4">
          <p className="text-lg text-gray-700 leading-relaxed">
            {errorInfo.description}
          </p>
          
          {userEmail && (
            <p className="text-sm text-gray-600">
              Email: <span className="font-medium">{userEmail}</span>
            </p>
          )}
        </div>

        {/* Suggestions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
          <h3 className="text-lg font-medium text-blue-900 mb-4 text-center">
            Here's what you can try:
          </h3>
          
          <ul className="space-y-3">
            {errorInfo.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {suggestion}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Retry Attempts Info */}
        {maxRetryAttempts > 1 && (
          <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            Attempt {currentAttempt} of {maxRetryAttempts}
            {!canRetry && (
              <span className="text-red-600 ml-2">
                • Maximum attempts reached
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Primary Action Button */}
          {canRetry && onRetry && (
            <Button
              variant="primary"
              size="lg"
              onClick={handleRetry}
              className="w-full justify-center min-h-[56px]"
              autoFocus
            >
              Try Again ({maxRetryAttempts - currentAttempt} attempts left)
            </Button>
          )}

          {/* Start Over Button */}
          {(!canRetry || !onRetry) && (
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartOver}
              className="w-full justify-center min-h-[56px]"
              autoFocus
            >
              Start Sign-In Over
            </Button>
          )}

          {/* Secondary Actions */}
          <div className="flex flex-col gap-3">
            {showBackButton && onGoBack && canRetry && (
              <Button
                variant="outline"
                size="md"
                onClick={handleGoBack}
                className="w-full justify-center min-h-[48px]"
              >
                Go Back
              </Button>
            )}

            {showSupportButton && (
              <Button
                variant="outline"
                size="md"
                onClick={handleContactSupport}
                className="w-full justify-center min-h-[48px]"
              >
                Contact Support Team
              </Button>
            )}
          </div>
        </div>

        {/* Technical Details Toggle */}
        <div className="pt-6 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleTechnicalDetails}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            {showTechnicalDetails ? 'Hide' : 'Show'} Technical Details
          </Button>
          
          {showTechnicalDetails && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Error Message:</span> {errorMessage}
                </div>
                {errorCode && (
                  <div>
                    <span className="font-medium">Error Code:</span> {errorCode}
                  </div>
                )}
                <div>
                  <span className="font-medium">Timestamp:</span> {new Date().toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Browser:</span> {navigator.userAgent.split(' ')[0]}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Support Information */}
        <div className="pt-4 text-center">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 leading-relaxed">
              Need immediate help? Call our support team:
            </p>
            <a 
              href="tel:1-800-MIND-VIT"
              className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors block"
              onClick={() => announceButtonAction('Calling support phone number')}
            >
              1-800-MIND-VIT (1-800-646-3848)
            </a>
            <p className="text-xs text-gray-500">
              Available Monday-Friday, 9 AM - 5 PM EST
            </p>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              Or email us at{' '}
              <a 
                href="mailto:support@mindvitality.com" 
                className="text-blue-600 underline hover:text-blue-800 transition-colors"
                onClick={() => announceButtonAction('Opening email to contact support')}
              >
                support@mindvitality.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </SingleActionLayout>
  );
}

