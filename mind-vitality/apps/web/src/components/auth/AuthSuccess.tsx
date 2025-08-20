'use client';

import React from 'react';
import { Button } from '@mind-vitality/ui';
import { SingleActionLayout } from '@/components/layout/SingleActionLayout';
import { useAuth } from './AuthProvider';
import { useAudioNarrationContext } from '@/components/layout/AudioNarrationProvider';

interface AuthSuccessProps {
  userEmail?: string;
  userName?: string;
  redirectUrl?: string;
  onContinue?: () => void;
  showContinueButton?: boolean;
  autoRedirect?: boolean;
  autoRedirectDelay?: number;
}

/**
 * Senior-friendly authentication success component with audio confirmation
 * 
 * Features:
 * - Clear visual success indicators with high contrast
 * - Audio confirmation of successful authentication
 * - Personalized welcome messages
 * - Auto-redirect functionality with countdown
 * - Large, accessible action buttons
 * - Senior-friendly messaging and guidance
 * - Integration with SingleActionLayout pattern
 * - Keyboard navigation support
 * - Option to continue manually or auto-redirect
 */
export function AuthSuccess({ 
  userEmail,
  userName,
  redirectUrl = '/',
  onContinue,
  showContinueButton = true,
  autoRedirect = false,
  autoRedirectDelay = 5
}: AuthSuccessProps) {
  const [countdown, setCountdown] = React.useState(autoRedirectDelay);
  const [hasAnnounced, setHasAnnounced] = React.useState(false);
  const { user } = useAuth();
  const { 
    announceSuccess, 
    announceNavigation,
    announceButtonAction 
  } = useAudioNarrationContext();

  // Get user info from auth context or props
  const displayName = userName || user?.name || userEmail || 'there';
  const displayEmail = userEmail || user?.email;

  // Announce success when component mounts
  React.useEffect(() => {
    if (!hasAnnounced) {
      const successMessage = `Welcome ${displayName}! You have successfully signed in to Mind Vitality.`;
      announceSuccess(successMessage);
      
      if (autoRedirect) {
        announceNavigation(`You will be automatically redirected to your dashboard in ${autoRedirectDelay} seconds.`);
      }
      
      setHasAnnounced(true);
    }
  }, [announceSuccess, announceNavigation, displayName, autoRedirect, autoRedirectDelay, hasAnnounced]);

  // Handle auto-redirect countdown
  React.useEffect(() => {
    if (autoRedirect && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (autoRedirect && countdown === 0) {
      handleContinue();
    }
  }, [autoRedirect, countdown]);

  // Handle continue action
  const handleContinue = () => {
    announceNavigation('Taking you to your Mind Vitality dashboard');
    
    if (onContinue) {
      onContinue();
    } else {
      // Redirect to specified URL or default dashboard
      window.location.href = redirectUrl;
    }
  };

  // Handle manual continue button click
  const handleContinueClick = () => {
    announceButtonAction('Continuing to your dashboard');
    handleContinue();
  };

  return (
    <SingleActionLayout
      title="Welcome to Mind Vitality!"
      subtitle="You have successfully signed in"
      currentStep={2}
      totalSteps={2}
      showBackButton={false}
      className="text-center"
    >
      <div className="w-full max-w-md space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Welcome{displayName !== 'there' ? `, ${displayName}` : ''}!
          </h2>
          
          <div className="space-y-2">
            <p className="text-lg text-gray-700">
              You are now signed in to Mind Vitality.
            </p>
            
            {displayEmail && (
              <p className="text-sm text-gray-600">
                Signed in as: <span className="font-medium">{displayEmail}</span>
              </p>
            )}
          </div>
        </div>

        {/* Success Features */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-3">
          <h3 className="text-lg font-medium text-green-900 mb-4">
            What's Next?
          </h3>
          
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <svg 
                className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" 
                />
              </svg>
              <p className="text-sm text-green-800">
                Access your personalized dashboard
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <svg 
                className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" 
                />
              </svg>
              <p className="text-sm text-green-800">
                Start your cognitive health journey
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <svg 
                className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" 
                />
              </svg>
              <p className="text-sm text-green-800">
                Explore brain games and activities
              </p>
            </div>
          </div>
        </div>

        {/* Auto-redirect information */}
        {autoRedirect && countdown > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 text-center">
              Automatically redirecting in{' '}
              <span className="font-semibold text-lg">{countdown}</span> second{countdown === 1 ? '' : 's'}
            </p>
          </div>
        )}

        {/* Continue Button */}
        {showContinueButton && (
          <div className="pt-4 space-y-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinueClick}
              className="w-full justify-center min-h-[56px]"
              autoFocus
            >
              {autoRedirect && countdown > 0 
                ? `Continue Now (${countdown}s)` 
                : 'Continue to Dashboard'
              }
            </Button>
            
            {autoRedirect && (
              <p className="text-xs text-gray-500 text-center">
                Or wait for automatic redirect
              </p>
            )}
          </div>
        )}

        {/* Security Note */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <svg 
              className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
            <p className="leading-relaxed">
              Your session is secure and will remain active for your convenience. 
              You can safely close this tab and return later without needing to sign in again.
            </p>
          </div>
        </div>

        {/* Support Information */}
        <div className="pt-4 text-center">
          <p className="text-sm text-gray-600 leading-relaxed">
            Need help getting started? Contact our support team at{' '}
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
    </SingleActionLayout>
  );
}
