'use client';

import React from 'react';
import { Button } from '@mind-vitality/ui';
import { SingleActionLayout } from '@/components/layout/SingleActionLayout';
import { useAuth } from './AuthProvider';
import { useAudioNarrationContext } from '@/components/layout/AudioNarrationProvider';

interface VerificationCodeInputProps {
  email: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onResendCode?: () => void;
  codeLength?: number;
}

/**
 * Senior-friendly verification code input component with individual digit inputs
 * 
 * Features:
 * - Individual large digit inputs for easy code entry
 * - Clear instructions and audio narration
 * - Auto-focus progression between inputs
 * - Paste support for complete codes
 * - Audio feedback for each digit entered
 * - Senior-friendly error handling
 * - Resend code functionality with countdown
 * - Large tap targets and high contrast
 * - Keyboard navigation support (arrow keys, backspace)
 */
export function VerificationCodeInput({ 
  email, 
  onSuccess, 
  onError, 
  onResendCode,
  codeLength = 6 
}: VerificationCodeInputProps) {
  const [code, setCode] = React.useState<string[]>(new Array(codeLength).fill(''));
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [verificationError, setVerificationError] = React.useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = React.useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = React.useState(3);
  
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>(new Array(codeLength).fill(null));
  const { isLoading } = useAuth();
  const { 
    announceInstruction, 
    announceError, 
    announceSuccess,
    announceButtonAction,
    announceNavigation 
  } = useAudioNarrationContext();

  // Announce instructions when component mounts
  React.useEffect(() => {
    announceInstruction(
      `Verification code sent to ${email}. Enter the ${codeLength}-digit code below. Each box is for one digit.`
    );
  }, [announceInstruction, email, codeLength]);

  // Start resend cooldown timer
  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle input change for individual digits
  const handleInputChange = (index: number, value: string) => {
    // Only allow single digits
    if (value.length > 1) {
      value = value.slice(-1);
    }
    
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Clear error when user starts typing
    if (verificationError) {
      setVerificationError(null);
    }

    // Auto-focus next input
    if (value && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when code is complete
    if (newCode.every(digit => digit) && newCode.join('').length === codeLength) {
      setTimeout(() => handleVerifyCode(newCode.join('')), 100);
    }
  };

  // Handle key down events for better UX
  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const fullCode = code.join('');
      if (fullCode.length === codeLength) {
        handleVerifyCode(fullCode);
      }
    }
  };

  // Handle paste events
  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text').replace(/\s/g, '');
    
    if (pastedData.length === codeLength && /^\d+$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      announceSuccess(`${codeLength}-digit code pasted successfully`);
      
      // Focus the last input and auto-submit
      inputRefs.current[codeLength - 1]?.focus();
      setTimeout(() => handleVerifyCode(pastedData), 100);
    } else {
      announceError('Please paste a valid 6-digit code');
    }
  };

  // Handle code verification
  const handleVerifyCode = async (codeToVerify: string) => {
    if (codeToVerify.length !== codeLength) {
      setVerificationError(`Please enter all ${codeLength} digits`);
      announceError(`Please enter all ${codeLength} digits`);
      return;
    }

    setIsSubmitting(true);
    announceButtonAction('Verifying your code...');

    try {
      // In a real implementation, this would make an API call to verify the code
      // For now, simulate verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success/failure based on attempts
      if (codeToVerify === '123456' || attemptsRemaining === 1) {
        announceSuccess('Verification successful! Welcome to Mind Vitality.');
        onSuccess?.();
      } else {
        const newAttempts = attemptsRemaining - 1;
        setAttemptsRemaining(newAttempts);
        
        const errorMessage = newAttempts > 0 
          ? `Invalid code. You have ${newAttempts} attempt${newAttempts === 1 ? '' : 's'} remaining.`
          : 'Maximum attempts reached. Please request a new code.';
        
        setVerificationError(errorMessage);
        announceError(errorMessage);
        
        // Clear the code and focus first input
        setCode(new Array(codeLength).fill(''));
        inputRefs.current[0]?.focus();
        
        onError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unable to verify code. Please try again.';
      
      setVerificationError(errorMessage);
      announceError(`Verification failed: ${errorMessage}`);
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle manual verification
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const fullCode = code.join('');
    handleVerifyCode(fullCode);
  };

  // Handle resend code
  const handleResendCode = () => {
    setResendCooldown(60); // 1 minute cooldown
    setAttemptsRemaining(3); // Reset attempts
    setVerificationError(null);
    setCode(new Array(codeLength).fill(''));
    
    announceButtonAction(`New verification code requested. Code will be sent to ${email}`);
    onResendCode?.();
    
    // Focus first input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  return (
    <SingleActionLayout
      title="Enter Verification Code"
      subtitle={`We sent a ${codeLength}-digit code to ${email}`}
      steps={[
        { id: 'email', title: 'Enter Email', status: 'completed' },
        { id: 'verify', title: 'Verify Code', status: 'current' }
      ]}
      currentStepId="verify"
      showProgress={true}
      secondaryAction={{
        label: 'Go Back',
        onClick: () => {
          announceNavigation('Going back to email entry');
          // Handle back navigation
        },
        variant: 'outline'
      }}
    >
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
        {/* Code Input Section */}
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Enter the {codeLength}-digit code sent to your email. 
              You can type each digit or paste the entire code.
            </p>
          </div>

          {/* Individual Digit Inputs */}
          <div 
            className="flex justify-center gap-3"
            onPaste={handlePaste}
          >
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isSubmitting || isLoading}
                aria-label={`Digit ${index + 1} of ${codeLength}`}
                aria-invalid={verificationError ? 'true' : 'false'}
                className={`
                  w-14 h-14 text-2xl font-mono text-center
                  border-2 rounded-lg
                  focus:outline-none focus:ring-4 focus:ring-blue-500/20
                  transition-all duration-200
                  ${verificationError 
                    ? 'border-red-500 focus:border-red-600 bg-red-50' 
                    : 'border-gray-300 focus:border-blue-500 bg-white'
                  }
                  ${(isSubmitting || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}
                  ${digit ? 'border-blue-500 bg-blue-50' : ''}
                `}
              />
            ))}
          </div>

          {/* Error Message */}
          {verificationError && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-4 rounded-lg justify-center"
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
              <span className="text-center">{verificationError}</span>
            </div>
          )}
        </div>

        {/* Manual Verify Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting || isLoading || code.some(digit => !digit)}
            loading={isSubmitting || isLoading}
            className="w-full justify-center min-h-[56px]"
            onClick={() => {
              if (!isSubmitting && !isLoading) {
                announceButtonAction('Verifying your code');
              }
            }}
          >
            {isSubmitting || isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </div>

        {/* Resend Code Section */}
        <div className="pt-6 text-center space-y-4">
          <p className="text-sm text-gray-600">
            Didn't receive the code? Check your spam folder or request a new one.
          </p>
          
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={resendCooldown > 0 || isSubmitting || isLoading}
            onClick={handleResendCode}
            className="min-h-[48px]"
          >
            {resendCooldown > 0 
              ? `Resend Code (${resendCooldown}s)` 
              : 'Send New Code'
            }
          </Button>

          {attemptsRemaining < 3 && (
            <p className="text-sm text-orange-600">
              {attemptsRemaining} attempt{attemptsRemaining === 1 ? '' : 's'} remaining
            </p>
          )}
        </div>

        {/* Additional Help */}
        <div className="pt-4 text-center">
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

