'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@mind-vitality/utils';
import type { LogoProps as BaseLogoProps } from '@mind-vitality/types';

/**
 * Logo component variants using class-variance-authority
 * Implements senior-friendly design with proper scaling and contrast
 */
const logoVariants = cva(
  [
    // Base styles for all logos
    'inline-flex items-center',
    'select-none',
    'transition-all duration-200',
  ],
  {
    variants: {
      variant: {
        icon: 'justify-center',
        text: 'justify-start',
        full: 'justify-start gap-3',
      },
      size: {
        sm: 'text-lg', // 18px - minimum senior-friendly size
        md: 'text-xl', // 20px - comfortable reading size
        lg: 'text-2xl', // 24px - large and clear
        xl: 'text-3xl', // 28px - extra large for headers
      },
    },
    defaultVariants: {
      variant: 'full',
      size: 'md',
    },
  }
);

/**
 * Logo icon variants for consistent sizing
 */
const logoIconVariants = cva(
  [
    // Base styles for logo icons
    'flex items-center justify-center',
    'bg-primary-600 text-white',
    'rounded-lg font-bold',
    'shrink-0',
  ],
  {
    variants: {
      size: {
        sm: 'w-8 h-8 text-sm', // 32px
        md: 'w-10 h-10 text-base', // 40px
        lg: 'w-12 h-12 text-lg', // 48px
        xl: 'w-14 h-14 text-xl', // 56px
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

interface LogoProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof logoVariants> {
  variant?: 'icon' | 'text' | 'full';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  interactive?: boolean;
  onAudioNarrate?: (text: string) => void;
}

/**
 * Logo component with senior-friendly design and accessibility features
 * - Scalable sizes from small to extra large
 * - High contrast brand colors
 * - Multiple variants: icon-only, text-only, or full logo
 * - Optional interactive mode with audio narration
 * - Semantic markup for screen readers
 */
const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  (
    {
      className,
      variant,
      size,
      interactive = false,
      onAudioNarrate,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        // Announce logo interaction for audio narration
        if (onAudioNarrate && interactive) {
          onAudioNarrate('Mind Vitality logo');
        }

        // Call the original onClick handler
        if (onClick) {
          onClick(event);
        }
      },
      [onClick, onAudioNarrate, interactive]
    );

    const logoIcon = React.useMemo(() => (
      <div 
        className={cn(logoIconVariants({ size }))}
        aria-hidden="true"
      >
        MV
      </div>
    ), [size]);

    const logoText = React.useMemo(() => (
      <span 
        className={cn(
          'font-bold text-primary-600',
          // Ensure text scales with size
          size === 'sm' && 'text-lg',
          size === 'md' && 'text-xl', 
          size === 'lg' && 'text-2xl',
          size === 'xl' && 'text-3xl'
        )}
      >
        Mind Vitality
      </span>
    ), [size]);

    const logoContent = React.useMemo(() => {
      switch (variant) {
        case 'icon':
          return logoIcon;
        case 'text':
          return logoText;
        case 'full':
        default:
          return (
            <>
              {logoIcon}
              {logoText}
            </>
          );
      }
    }, [variant, logoIcon, logoText]);

    return (
      <div
        className={cn(
          logoVariants({ variant, size }),
          interactive && [
            'cursor-pointer',
            'hover:opacity-80 active:opacity-60',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            'rounded-md p-1 -m-1', // Add padding and negative margin for better focus ring
          ],
          className
        )}
        ref={ref}
        onClick={interactive ? handleClick : onClick}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={interactive ? 'Mind Vitality home' : undefined}
        onKeyDown={
          interactive
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleClick(event as any);
                }
              }
            : undefined
        }
        {...props}
      >
        {logoContent}
        
        {/* Screen reader text */}
        <span className="sr-only">
          Mind Vitality - Brain exercises for older adults
        </span>
      </div>
    );
  }
);

Logo.displayName = 'Logo';

export { Logo, logoVariants, logoIconVariants, type LogoProps };
