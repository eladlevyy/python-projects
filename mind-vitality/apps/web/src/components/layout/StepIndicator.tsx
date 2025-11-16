'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@mind-vitality/utils';

/**
 * Step indicator variants using class-variance-authority
 * Senior-friendly progress indicators with WCAG 2.2 AA compliance
 */
const stepIndicatorVariants = cva(
  [
    // Base styles for the step indicator container
    'flex items-center justify-center w-full',
    'py-6 px-4',
    'bg-white border-b-2 border-gray-100',
  ],
  {
    variants: {
      size: {
        sm: 'py-4',
        md: 'py-6',
        lg: 'py-8',
      },
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
      },
    },
    defaultVariants: {
      size: 'md',
      orientation: 'horizontal',
    },
  }
);

/**
 * Individual step variants
 */
const stepItemVariants = cva(
  [
    // Base styles for individual steps
    'flex items-center justify-center',
    'min-w-[44px] min-h-[44px]', // WCAG minimum tap target
    'rounded-full font-semibold',
    'transition-all duration-300',
    'border-2',
    // Senior-friendly text size
    'text-lg',
  ],
  {
    variants: {
      status: {
        pending: [
          'bg-gray-100 border-gray-300 text-gray-500',
          'cursor-default',
        ],
        current: [
          'bg-primary-600 border-primary-600 text-white',
          'ring-4 ring-primary-100',
          'cursor-default',
          'shadow-accessible',
        ],
        completed: [
          'bg-green-600 border-green-600 text-white',
          'cursor-default',
          'shadow-gentle',
        ],
        error: [
          'bg-red-600 border-red-600 text-white',
          'cursor-default',
          'ring-2 ring-red-200',
        ],
      },
      interactive: {
        true: [
          'cursor-pointer hover:scale-105',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        ],
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      status: 'pending',
      interactive: false,
    },
  }
);

/**
 * Props for individual step configuration
 */
interface Step {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'current' | 'completed' | 'error';
  optional?: boolean;
}

/**
 * Props for StepIndicator component
 */
interface StepIndicatorProps extends VariantProps<typeof stepIndicatorVariants> {
  steps: Step[];
  currentStepId: string;
  onStepClick?: (stepId: string) => void;
  className?: string;
  showLabels?: boolean;
  showDescription?: boolean;
  allowNavigation?: boolean;
  announceStep?: (stepTitle: string, stepNumber: number, totalSteps: number) => void;
  announceProgress?: (current: number, total: number) => void;
  ariaLabel?: string;
  maxVisibleSteps?: number;
}

/**
 * StepIndicator component with senior-friendly design and accessibility
 * 
 * Features:
 * - WCAG 2.2 AA compliant progress indication
 * - Large, clear visual indicators with high contrast
 * - Audio narration support for step changes
 * - Keyboard navigation support
 * - Senior-friendly typography and spacing
 * - Multiple status states (pending, current, completed, error)
 * - Optional step navigation
 * - Responsive design with mobile considerations
 */
export function StepIndicator({
  steps,
  currentStepId,
  onStepClick,
  size,
  orientation = 'horizontal',
  className,
  showLabels = true,
  showDescription = false,
  allowNavigation = false,
  announceStep,
  announceProgress,
  ariaLabel = 'Progress indicator',
  maxVisibleSteps,
  ...props
}: StepIndicatorProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);
  const completedSteps = steps.filter(step => step.status === 'completed').length;

  // Announce step changes
  React.useEffect(() => {
    if (announceStep && currentStepIndex >= 0) {
      const currentStep = steps[currentStepIndex];
      announceStep(currentStep.title, currentStepIndex + 1, steps.length);
    }
  }, [currentStepId, announceStep, currentStepIndex, steps]);

  // Announce progress changes
  React.useEffect(() => {
    if (announceProgress) {
      announceProgress(completedSteps, steps.length);
    }
  }, [completedSteps, steps.length, announceProgress]);

  // Handle step click
  const handleStepClick = (step: Step, index: number) => {
    if (!allowNavigation || !onStepClick) return;
    
    // Only allow navigation to completed steps or the current step
    if (step.status === 'completed' || step.status === 'current') {
      onStepClick(step.id);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, step: Step, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleStepClick(step, index);
    }
  };

  // Calculate visible steps for mobile
  const visibleSteps = maxVisibleSteps 
    ? steps.slice(Math.max(0, currentStepIndex - Math.floor(maxVisibleSteps / 2)), 
                 Math.min(steps.length, currentStepIndex + Math.ceil(maxVisibleSteps / 2)))
    : steps;

  const getStepIcon = (step: Step, index: number) => {
    switch (step.status) {
      case 'completed':
        return '✓';
      case 'error':
        return '✕';
      case 'current':
      case 'pending':
      default:
        return (index + 1).toString();
    }
  };

  const getStepAriaLabel = (step: Step, index: number) => {
    const stepNumber = index + 1;
    const statusText = step.status === 'completed' ? 'completed' : 
                      step.status === 'current' ? 'current step' :
                      step.status === 'error' ? 'has error' : 'pending';
    
    return `Step ${stepNumber} of ${steps.length}: ${step.title}, ${statusText}`;
  };

  return (
    <nav 
      className={cn(stepIndicatorVariants({ size, orientation }), className)}
      aria-label={ariaLabel}
      role="navigation"
      {...props}
    >
      {/* Progress bar background for horizontal layout */}
      {orientation === 'horizontal' && (
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t-2 border-gray-200 mx-8" />
        </div>
      )}

      {/* Steps container */}
      <div className={cn(
        'relative flex items-center',
        orientation === 'horizontal' ? 'space-x-8' : 'space-y-6 flex-col',
        'w-full max-w-4xl'
      )}>
        {visibleSteps.map((step, index) => {
          const actualIndex = steps.findIndex(s => s.id === step.id);
          const isInteractive = allowNavigation && (step.status === 'completed' || step.status === 'current');
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                {/* Step circle */}
                <div
                  className={cn(stepItemVariants({ 
                    status: step.status, 
                    interactive: isInteractive 
                  }))}
                  onClick={() => handleStepClick(step, actualIndex)}
                  onKeyDown={(e) => handleKeyDown(e, step, actualIndex)}
                  aria-label={getStepAriaLabel(step, actualIndex)}
                  aria-current={step.status === 'current' ? 'step' : undefined}
                  tabIndex={isInteractive ? 0 : -1}
                  role={isInteractive ? 'button' : 'img'}
                >
                  <span className="font-bold">
                    {getStepIcon(step, actualIndex)}
                  </span>
                </div>

                {/* Step label and description */}
                {showLabels && (
                  <div className="mt-3 text-center max-w-[150px]">
                    <p className={cn(
                      'text-base font-medium leading-tight',
                      step.status === 'current' ? 'text-primary-700' :
                      step.status === 'completed' ? 'text-green-700' :
                      step.status === 'error' ? 'text-red-700' :
                      'text-gray-600'
                    )}>
                      {step.title}
                      {step.optional && (
                        <span className="text-sm text-gray-500 ml-1">(optional)</span>
                      )}
                    </p>
                    
                    {showDescription && step.description && (
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Connecting line for horizontal layout */}
              {orientation === 'horizontal' && index < visibleSteps.length - 1 && (
                <div 
                  className={cn(
                    'flex-1 h-0.5 mx-4',
                    step.status === 'completed' ? 'bg-green-400' : 'bg-gray-200'
                  )}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress summary for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex]?.title}
        {completedSteps > 0 && `, ${completedSteps} steps completed`}
      </div>
    </nav>
  );
}

/**
 * Simple progress bar component for minimal step indication
 */
export function ProgressBar({
  current,
  total,
  className,
  showPercentage = true,
  announceProgress,
}: {
  current: number;
  total: number;
  className?: string;
  showPercentage?: boolean;
  announceProgress?: (current: number, total: number) => void;
}) {
  const percentage = Math.round((current / total) * 100);

  React.useEffect(() => {
    if (announceProgress) {
      announceProgress(current, total);
    }
  }, [current, total, announceProgress]);

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-base font-medium text-gray-700">
          Step {current} of {total}
        </span>
        {showPercentage && (
          <span className="text-base font-medium text-primary-600">
            {percentage}%
          </span>
        )}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-primary-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Progress: ${current} of ${total} steps completed`}
        />
      </div>
    </div>
  );
}

// Export variants for external use
export { stepIndicatorVariants, stepItemVariants };
