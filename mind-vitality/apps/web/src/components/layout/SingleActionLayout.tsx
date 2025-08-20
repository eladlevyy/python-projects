'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@mind-vitality/utils';
import { Button } from '@mind-vitality/ui';
import { StepIndicator, ProgressBar } from './StepIndicator';
import { useAudioNarrationContext } from './AudioNarrationProvider';

/**
 * SingleActionLayout component variants using class-variance-authority
 * Senior-friendly one-action-per-screen layout with accessibility features
 */
const singleActionLayoutVariants = cva(
  [
    // Base styles for the layout container
    'min-h-screen flex flex-col',
    'bg-gradient-to-br from-gray-50 to-gray-100',
  ],
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-br from-gray-50 to-gray-100',
        primary: 'bg-gradient-to-br from-primary-50 to-primary-100',
        secondary: 'bg-gradient-to-br from-gray-50 to-blue-50',
        success: 'bg-gradient-to-br from-green-50 to-green-100',
        error: 'bg-gradient-to-br from-red-50 to-red-100',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

/**
 * Content area variants
 */
const contentAreaVariants = cva(
  [
    // Base styles for content area
    'flex-1 flex flex-col items-center justify-center',
    'max-w-4xl mx-auto w-full',
    'text-center',
  ],
  {
    variants: {
      size: {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
      },
      spacing: {
        tight: 'space-y-4',
        normal: 'space-y-6',
        loose: 'space-y-8',
        relaxed: 'space-y-10',
      },
    },
    defaultVariants: {
      size: 'md',
      spacing: 'normal',
    },
  }
);

/**
 * Step configuration interface
 */
interface StepConfig {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'current' | 'completed' | 'error';
  optional?: boolean;
}

/**
 * Action button configuration interface
 */
interface ActionButton {
  label: string;
  onClick: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  'aria-describedby'?: string;
}

/**
 * Props for SingleActionLayout component
 */
interface SingleActionLayoutProps extends VariantProps<typeof singleActionLayoutVariants> {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  
  // Step indicator props
  steps?: StepConfig[];
  currentStepId?: string;
  showProgress?: boolean;
  allowStepNavigation?: boolean;
  onStepChange?: (stepId: string) => void;
  
  // Action buttons
  primaryAction?: ActionButton;
  secondaryAction?: ActionButton;
  tertiaryAction?: ActionButton;
  
  // Layout customization
  className?: string;
  contentSize?: 'sm' | 'md' | 'lg' | 'xl';
  contentSpacing?: 'tight' | 'normal' | 'loose' | 'relaxed';
  
  // Accessibility
  skipToAction?: boolean;
  announcePageLoad?: boolean;
  pageTitle?: string;
  
  // Footer content
  footer?: React.ReactNode;
  showReturnHome?: boolean;
  onReturnHome?: () => void;
}

/**
 * SingleActionLayout component with senior-friendly design and accessibility
 * 
 * Features:
 * - Enforces one-action-per-screen pattern for cognitive simplicity
 * - WCAG 2.2 AA compliant layout with proper focus management
 * - Large, clear typography and generous spacing
 * - Audio narration integration for step announcements
 * - Keyboard navigation support throughout
 * - Progress indication with clear visual hierarchy
 * - Senior-friendly color scheme and contrast ratios
 * - Responsive design optimized for touch devices
 * - Skip links for efficient navigation
 */
export function SingleActionLayout({
  children,
  title,
  subtitle,
  description,
  
  // Step props
  steps,
  currentStepId,
  showProgress = true,
  allowStepNavigation = false,
  onStepChange,
  
  // Action props
  primaryAction,
  secondaryAction,
  tertiaryAction,
  
  // Layout props
  variant,
  padding,
  className,
  contentSize = 'md',
  contentSpacing = 'normal',
  
  // Accessibility props
  skipToAction = true,
  announcePageLoad = true,
  pageTitle,
  
  // Footer props
  footer,
  showReturnHome = false,
  onReturnHome,
  
  ...props
}: SingleActionLayoutProps) {
  const { 
    announceNavigation, 
    announceInstruction, 
    announceButtonAction, 
    announceProgress 
  } = useAudioNarrationContext();

  const primaryActionRef = React.useRef<HTMLButtonElement>(null);
  const [isPerformingAction, setIsPerformingAction] = React.useState(false);

  // Announce page load
  React.useEffect(() => {
    if (announcePageLoad && (pageTitle || title)) {
      const announcement = pageTitle || title || 'New page loaded';
      announceNavigation(announcement);
    }
  }, [announcePageLoad, pageTitle, title, announceNavigation]);

  // Announce instructions
  React.useEffect(() => {
    if (description) {
      // Delay to let page announcement complete first
      const timer = setTimeout(() => {
        announceInstruction(description);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [description, announceInstruction]);

  // Handle primary action with loading state
  const handlePrimaryAction = React.useCallback(async () => {
    if (!primaryAction?.onClick || isPerformingAction) return;
    
    setIsPerformingAction(true);
    
    try {
      await primaryAction.onClick();
      announceButtonAction(`${primaryAction.label} completed successfully`);
    } catch (error) {
      announceButtonAction(`Error performing ${primaryAction.label}. Please try again.`);
      console.error('Primary action error:', error);
    } finally {
      setIsPerformingAction(false);
    }
  }, [primaryAction, isPerformingAction, announceButtonAction]);

  // Handle secondary action
  const handleSecondaryAction = React.useCallback(async () => {
    if (!secondaryAction?.onClick) return;
    
    try {
      await secondaryAction.onClick();
      announceButtonAction(`${secondaryAction.label} completed`);
    } catch (error) {
      announceButtonAction(`Error performing ${secondaryAction.label}`);
      console.error('Secondary action error:', error);
    }
  }, [secondaryAction, announceButtonAction]);

  // Handle tertiary action
  const handleTertiaryAction = React.useCallback(async () => {
    if (!tertiaryAction?.onClick) return;
    
    try {
      await tertiaryAction.onClick();
      announceButtonAction(`${tertiaryAction.label} completed`);
    } catch (error) {
      announceButtonAction(`Error performing ${tertiaryAction.label}`);
      console.error('Tertiary action error:', error);
    }
  }, [tertiaryAction, announceButtonAction]);

  // Handle return home
  const handleReturnHome = React.useCallback(() => {
    if (onReturnHome) {
      onReturnHome();
      announceNavigation('Returning to home page');
    }
  }, [onReturnHome, announceNavigation]);

  // Auto-focus primary action when it becomes available and not loading
  React.useEffect(() => {
    if (primaryAction && !isPerformingAction && !primaryAction.loading && primaryActionRef.current) {
      // Small delay to ensure page is ready
      const timer = setTimeout(() => {
        primaryActionRef.current?.focus();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [primaryAction, isPerformingAction]);

  return (
    <div className={cn(singleActionLayoutVariants({ variant, padding }), className)} {...props}>
      {/* Skip to action link */}
      {skipToAction && primaryAction && (
        <a
          href="#primary-action"
          className="sr-only focus:not-sr-only absolute top-4 left-4 z-50 bg-primary-600 text-white px-4 py-2 rounded-md text-lg font-medium"
        >
          Skip to main action
        </a>
      )}

      {/* Step indicator */}
      {steps && currentStepId && showProgress && (
        <div className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4">
            <StepIndicator
              steps={steps}
              currentStepId={currentStepId}
              onStepClick={allowStepNavigation ? onStepChange : undefined}
              allowNavigation={allowStepNavigation}
              showLabels={true}
              announceStep={(title, current, total) => {
                announceNavigation(`Step ${current} of ${total}: ${title}`);
              }}
              announceProgress={announceProgress}
            />
          </div>
        </div>
      )}

      {/* Simple progress bar for basic steps */}
      {!steps && showProgress && currentStepId && (
        <div className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 py-4">
          <div className="max-w-6xl mx-auto px-4">
            <ProgressBar 
              current={1} 
              total={1} 
              announceProgress={announceProgress}
            />
          </div>
        </div>
      )}

      {/* Main content area */}
      <main 
        className={cn(contentAreaVariants({ size: contentSize, spacing: contentSpacing }))}
        id="main-content"
      >
        {/* Page header */}
        {(title || subtitle) && (
          <header className="mb-8 space-y-4">
            {title && (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {title}
              </h1>
            )}
            
            {subtitle && (
              <h2 className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed">
                {subtitle}
              </h2>
            )}
          </header>
        )}

        {/* Description */}
        {description && (
          <div className="mb-8">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center w-full mb-8">
          {children}
        </div>

        {/* Action buttons */}
        {(primaryAction || secondaryAction || tertiaryAction) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-2xl">
            {/* Primary action - most prominent */}
            {primaryAction && (
              <Button
                ref={primaryActionRef}
                id="primary-action"
                variant={primaryAction.variant || 'primary'}
                size={primaryAction.size || 'lg'}
                onClick={handlePrimaryAction}
                loading={isPerformingAction || primaryAction.loading}
                disabled={primaryAction.disabled || isPerformingAction}
                onAudioNarrate={announceButtonAction}
                aria-describedby={primaryAction['aria-describedby']}
                className="min-w-[200px] w-full sm:w-auto"
              >
                {primaryAction.icon && (
                  <span className="mr-2" aria-hidden="true">
                    {primaryAction.icon}
                  </span>
                )}
                {primaryAction.label}
              </Button>
            )}

            {/* Secondary action */}
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant || 'outline'}
                size={secondaryAction.size || 'lg'}
                onClick={handleSecondaryAction}
                loading={secondaryAction.loading}
                disabled={secondaryAction.disabled}
                onAudioNarrate={announceButtonAction}
                aria-describedby={secondaryAction['aria-describedby']}
                className="min-w-[200px] w-full sm:w-auto"
              >
                {secondaryAction.icon && (
                  <span className="mr-2" aria-hidden="true">
                    {secondaryAction.icon}
                  </span>
                )}
                {secondaryAction.label}
              </Button>
            )}

            {/* Tertiary action - least prominent */}
            {tertiaryAction && (
              <Button
                variant={tertiaryAction.variant || 'ghost'}
                size={tertiaryAction.size || 'md'}
                onClick={handleTertiaryAction}
                loading={tertiaryAction.loading}
                disabled={tertiaryAction.disabled}
                onAudioNarrate={announceButtonAction}
                aria-describedby={tertiaryAction['aria-describedby']}
                className="w-full sm:w-auto"
              >
                {tertiaryAction.icon && (
                  <span className="mr-2" aria-hidden="true">
                    {tertiaryAction.icon}
                  </span>
                )}
                {tertiaryAction.label}
              </Button>
            )}
          </div>
        )}

        {/* Return home option */}
        {showReturnHome && (
          <div className="mt-8">
            <Button
              variant="ghost"
              size="md"
              onClick={handleReturnHome}
              onAudioNarrate={announceButtonAction}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Return to Home
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      {footer && (
        <footer className="w-full bg-white/80 backdrop-blur-sm border-t border-gray-200 py-6">
          <div className="max-w-6xl mx-auto px-4">
            {footer}
          </div>
        </footer>
      )}

      {/* Screen reader announcements */}
      <div
        id="single-action-announcements"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
    </div>
  );
}

/**
 * Simplified SingleActionLayout for basic use cases
 */
export function SimpleSingleActionLayout({
  children,
  title,
  description,
  action,
  onBack,
  className,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
  action?: ActionButton;
  onBack?: () => void;
  className?: string;
}) {
  return (
    <SingleActionLayout
      title={title}
      description={description}
      primaryAction={action}
      secondaryAction={onBack ? {
        label: 'Go Back',
        onClick: onBack,
        variant: 'outline'
      } : undefined}
      className={className}
      contentSize="sm"
    >
      {children}
    </SingleActionLayout>
  );
}

// Export variants for external use
export { singleActionLayoutVariants, contentAreaVariants };
export type { SingleActionLayoutProps, StepConfig, ActionButton };
