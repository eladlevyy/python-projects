'use client';

import React from 'react';
import { Button } from '@mind-vitality/ui';
import { SingleActionLayout } from '@/components/layout/SingleActionLayout';
import { useAuth } from './AuthProvider';
import { useAudioNarrationContext } from '@/components/layout/AudioNarrationProvider';

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  returnTo?: string;
}

/**
 * Senior-friendly login form component with large input fields and clear instructions
 * 
 * Features:
 * - Large, accessible input fields with high contrast
 * - Clear step-by-step instructions with audio narration
 * - Passwordless authentication flow (email-based)
 * - Single action per screen pattern
 * - Audio feedback for all interactions
 * - Senior-friendly error handling
 * - Keyboard navigation support
 */
export function LoginForm({ onSuccess, onError, returnTo }: LoginFormProps) {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  
  const { loginWithAudio, isLoading } = useAuth();
  const { 
    announceInstruction, 
    announceError, 
    announceSuccess,
    announceButtonAction 
  } = useAudioNarrationContext();

  // Announce instructions when component mounts
  React.useEffect(() => {
    announceInstruction(
      'Welcome to Mind Vitality sign in. Enter your email address to receive a secure sign-in link. No password needed.'
    );
  }, [announceInstruction]);

  // Validate email address
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError(null);
    return true;
  };

  // Handle email input changes
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateEmail(email)) {
      announceError(emailError || 'Please check your email address');
      return;
    }

    setIsSubmitting(true);
    announceButtonAction('Sending secure sign-in link to your email address...');

    try {
      // Use the audio-enhanced login method
      loginWithAudio({ 
        returnTo: returnTo || '/',
        // Pass email for potential future use
        screen_hint: 'signup',
        login_hint: email
      });
      
      announceSuccess(
        `Sign-in link sent to ${email}. Please check your email and click the link to complete sign in.`
      );
      
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unable to send sign-in link. Please try again.';
      
      setEmailError(errorMessage);
      announceError(`Sign-in failed: ${errorMessage}`);
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SingleActionLayout
      title="Sign In to Mind Vitality"
      subtitle="Enter your email to receive a secure sign-in link"
      steps={[
        { id: 'email', title: 'Enter Email', status: 'current' },
        { id: 'verify', title: 'Verify Code', status: 'pending' }
      ]}
      currentStepId="email"
      showProgress={true}
    >
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
        {/* Email Input Section */}
        <div className="space-y-4">
          <label 
            htmlFor="email" 
            className="block text-lg font-medium text-gray-900 mb-3"
          >
            Email Address
          </label>
          
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={() => validateEmail(email)}
            disabled={isSubmitting || isLoading}
            aria-invalid={emailError ? 'true' : 'false'}
            aria-describedby={emailError ? 'email-error' : 'email-help'}
            className={`
              w-full px-6 py-4 text-lg 
              border-2 rounded-lg 
              focus:outline-none focus:ring-4 focus:ring-blue-500/20
              transition-all duration-200
              min-h-[56px]
              ${emailError 
                ? 'border-red-500 focus:border-red-600 bg-red-50' 
                : 'border-gray-300 focus:border-blue-500 bg-white'
              }
              ${(isSubmitting || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            placeholder="your-email@example.com"
          />
          
          {/* Email Help Text */}
          {!emailError && (
            <p id="email-help" className="text-sm text-gray-600">
              We'll send you a secure link to sign in. No password required.
            </p>
          )}
          
          {/* Email Error Message */}
          {emailError && (
            <div
              id="email-error"
              role="alert"
              aria-live="polite"
              className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded"
            >
              <svg 
                className="w-5 h-5 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span>{emailError}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting || isLoading || !!emailError}
            loading={isSubmitting || isLoading}
            className="w-full justify-center min-h-[56px]"
            onClick={() => {
              if (!isSubmitting && !isLoading) {
                announceButtonAction('Sending sign-in link to your email');
              }
            }}
          >
            {isSubmitting || isLoading ? 'Sending Sign-In Link...' : 'Send Sign-In Link'}
          </Button>
        </div>

        {/* Additional Help */}
        <div className="pt-6 text-center">
          <p className="text-sm text-gray-600 leading-relaxed">
            Having trouble? Contact our support team at{' '}
            <a 
              href="mailto:support@mindvitality.com" 
              className="text-blue-600 underline hover:text-blue-800 transition-colors"
              onClick={() => announceButtonAction('Opening email to contact support')}
            >
              support@mindvitality.com
            </a>
          </p>
        </div>
      </form>
    </SingleActionLayout>
  );
}

