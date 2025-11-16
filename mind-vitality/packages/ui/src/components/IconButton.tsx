'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@mind-vitality/utils';
import type { IconButtonProps as BaseIconButtonProps } from '@mind-vitality/types';

/**
 * IconButton component variants using class-variance-authority
 * Implements senior-friendly design with WCAG 2.2 AA compliance
 */
const iconButtonVariants = cva(
  [
    // Base styles for all icon buttons
    'inline-flex items-center justify-center',
    'rounded-xl transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    // Ensure minimum tap target (WCAG 2.2 AA)
    'min-w-[44px] min-h-[44px]',
    // Prevent text selection for better UX
    'select-none',
    // Enhance touch interaction
    'active:scale-95 transform',
    // Better alignment for icons
    'shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary-600 text-white',
          'hover:bg-primary-700 active:bg-primary-800',
          'shadow-sm hover:shadow-md',
          'border border-primary-600 hover:border-primary-700',
        ],
        secondary: [
          'bg-gray-100 text-gray-900',
          'hover:bg-gray-200 active:bg-gray-300',
          'border border-gray-300 hover:border-gray-400',
          'shadow-sm hover:shadow-md',
        ],
        outline: [
          'border-2 border-primary-600 text-primary-600',
          'hover:bg-primary-50 active:bg-primary-100',
          'hover:border-primary-700 hover:text-primary-700',
          'bg-white',
        ],
        ghost: [
          'text-gray-600',
          'hover:bg-gray-100 active:bg-gray-200',
          'hover:text-gray-900',
        ],
        destructive: [
          'bg-red-600 text-white',
          'hover:bg-red-700 active:bg-red-800',
          'border border-red-600 hover:border-red-700',
          'shadow-sm hover:shadow-md',
        ],
      },
      size: {
        sm: [
          'w-11 h-11', // 44px minimum tap target
          'text-sm',
        ],
        md: [
          'w-12 h-12', // 48px - comfortable for seniors
          'text-base',
        ],
        lg: [
          'w-14 h-14', // 56px - large and easy to tap
          'text-lg',
        ],
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  }
);

interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof iconButtonVariants> {
  children?: React.ReactNode;
  asChild?: boolean;
  loading?: boolean;
  'aria-label': string; // Required for accessibility
  'aria-describedby'?: string;
  onAudioNarrate?: (text: string) => void;
}

/**
 * IconButton component with senior-friendly design and accessibility features
 * - Minimum 44x44px tap targets (WCAG 2.2 AA)
 * - Required aria-label for screen readers
 * - High contrast colors with proper focus states
 * - Audio narration support
 * - Enhanced touch interaction feedback
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      onClick,
      onAudioNarrate,
      disabled,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        // Announce button action for audio narration
        if (onAudioNarrate && !disabled && !loading) {
          onAudioNarrate(ariaLabel);
        }

        // Call the original onClick handler
        if (onClick && !disabled && !loading) {
          onClick(event);
        }
      },
      [onClick, onAudioNarrate, disabled, loading, ariaLabel]
    );

    const buttonContent = React.useMemo(() => {
      if (loading) {
        return (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="sr-only">Loading</span>
          </>
        );
      }

      return children;
    }, [loading, children]);

    // Validate that aria-label is provided (required for accessibility)
    if (!ariaLabel) {
      console.warn('IconButton: aria-label is required for accessibility. Please provide a descriptive label.');
    }

    return (
      <Comp
        className={cn(
          iconButtonVariants({ variant, size }),
          loading && 'cursor-wait',
          className
        )}
        ref={ref}
        onClick={handleClick}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        type={asChild ? undefined : 'button'}
        {...props}
      >
        {buttonContent}
      </Comp>
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton, iconButtonVariants, type IconButtonProps };
