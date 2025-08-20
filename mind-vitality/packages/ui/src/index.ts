/**
 * Mind Vitality - UI Component Library
 * Senior-friendly, accessible React components with WCAG 2.2 AA compliance
 */

// ===== COMPONENT EXPORTS =====
// Note: These components will be implemented in Task 2
// For now, we export placeholder types and basic structure

// Re-export utilities from @mind-vitality/utils for convenience
export { cn } from '@mind-vitality/utils';

// Re-export base types from @mind-vitality/types for convenience
export type {
  ButtonVariant,
  ButtonSize,
  IconButtonVariant,
  LogoVariant
} from '@mind-vitality/types';

// ===== COMPONENT EXPORTS =====
// Actual component implementations

/**
 * Button component with senior-friendly design and accessibility features
 * - Minimum 44x44px tap targets (WCAG 2.2 AA)
 * - High contrast colors with proper focus states
 * - Audio narration support for screen readers
 * - Large, clear typography
 * - Enhanced touch interaction feedback
 */
export { Button, buttonVariants } from './components/Button';
export type { ButtonProps } from './components/Button';

/**
 * IconButton component with senior-friendly design and accessibility features
 * - Minimum 44x44px tap targets (WCAG 2.2 AA)
 * - Required aria-label for screen readers
 * - High contrast colors with proper focus states
 * - Audio narration support
 * - Enhanced touch interaction feedback
 */
export { IconButton, iconButtonVariants } from './components/IconButton';
export type { IconButtonProps } from './components/IconButton';

/**
 * Logo component with senior-friendly design and accessibility features
 * - Scalable sizes from small to extra large
 * - High contrast brand colors
 * - Multiple variants: icon-only, text-only, or full logo
 * - Optional interactive mode with audio narration
 * - Semantic markup for screen readers
 */
export { Logo, logoVariants, logoIconVariants } from './components/Logo';
export type { LogoProps } from './components/Logo';

// ===== DESIGN SYSTEM EXPORTS =====
// Export design tokens and utilities that components will use

/**
 * Design tokens for consistent component styling
 * These will be used by components in Task 2
 */
export const designTokens = {
  // Minimum tap target size for seniors (WCAG 2.2 AA)
  minTapTarget: '44px',
  
  // Senior-friendly spacing scale
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '0.75rem', // 12px
    lg: '1rem',    // 16px
    xl: '1.5rem',  // 24px
    '2xl': '2rem', // 32px
    '3xl': '3rem', // 48px
  },
  
  // Typography scale for seniors
  fontSize: {
    sm: '16px',  // Minimum for seniors
    base: '18px', // Preferred base
    lg: '20px',
    xl: '22px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '32px',
  },
  
  // Border radius for senior-friendly design
  borderRadius: {
    sm: '0.375rem', // 6px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
    '2xl': '1.25rem', // 20px
  },
  
  // Animation durations (longer for seniors)
  animation: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },
} as const;

/**
 * Component variants using class-variance-authority
 * These will be used by components in Task 2
 */
export const componentVariants = {
  button: {
    base: [
      // Base styles for all buttons
      'inline-flex items-center justify-center',
      'font-medium rounded-xl',
      'transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      // Ensure minimum tap target
      'tap-target',
    ],
    variants: {
      variant: {
        primary: [
          'bg-primary-600 text-white',
          'hover:bg-primary-700 active:bg-primary-800',
          'shadow-sm hover:shadow-md',
        ],
        secondary: [
          'bg-gray-100 text-gray-900',
          'hover:bg-gray-200 active:bg-gray-300',
          'border border-gray-300',
        ],
        outline: [
          'border border-primary-600 text-primary-600',
          'hover:bg-primary-50 active:bg-primary-100',
          'hover:border-primary-700',
        ],
        ghost: [
          'text-gray-700',
          'hover:bg-gray-100 active:bg-gray-200',
        ],
      },
      size: {
        sm: 'px-4 py-2 text-base min-h-[44px]', // Ensure 44px minimum
        md: 'px-6 py-3 text-lg min-h-[48px]',
        lg: 'px-8 py-4 text-xl min-h-[52px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
  
  iconButton: {
    base: [
      'inline-flex items-center justify-center',
      'rounded-xl transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      // Ensure minimum tap target
      'tap-target',
    ],
    variants: {
      variant: {
        primary: [
          'bg-primary-600 text-white',
          'hover:bg-primary-700 active:bg-primary-800',
        ],
        secondary: [
          'bg-gray-100 text-gray-900',
          'hover:bg-gray-200 active:bg-gray-300',
        ],
        ghost: [
          'text-gray-700',
          'hover:bg-gray-100 active:bg-gray-200',
        ],
      },
      size: {
        sm: 'w-11 h-11 text-sm', // 44px minimum
        md: 'w-12 h-12 text-base', // 48px
        lg: 'w-14 h-14 text-lg', // 56px
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  },
} as const;

/**
 * Accessibility utilities for components
 * These will be used by components in Task 2
 */
export const a11yUtils = {
  /**
   * Generate ARIA props for interactive elements
   */
  generateInteractiveProps: (options: {
    label?: string;
    description?: string;
    disabled?: boolean;
    pressed?: boolean;
    expanded?: boolean;
  }) => {
    const { label, description, disabled, pressed, expanded } = options;
    const props: Record<string, any> = {};

    if (label) props['aria-label'] = label;
    if (description) props['aria-describedby'] = description;
    if (disabled) props['aria-disabled'] = 'true';
    if (typeof pressed === 'boolean') props['aria-pressed'] = pressed.toString();
    if (typeof expanded === 'boolean') props['aria-expanded'] = expanded.toString();

    return props;
  },

  /**
   * Generate focus management props
   */
  generateFocusProps: (options: {
    autoFocus?: boolean;
    tabIndex?: number;
  } = {}) => {
    const { autoFocus, tabIndex } = options;
    const props: Record<string, any> = {};

    if (autoFocus) props.autoFocus = true;
    if (typeof tabIndex === 'number') props.tabIndex = tabIndex;

    return props;
  },
} as const;

// ===== HOOKS EXPORTS =====
// These will be implemented in Task 2 along with the components

/**
 * Hook for managing component audio narration
 * Will be implemented in Task 2
 */
export function useComponentNarration() {
  throw new Error('useComponentNarration hook not yet implemented. Will be created in Task 2.');
}

/**
 * Hook for managing focus within components
 * Will be implemented in Task 2
 */
export function useFocusManagement() {
  throw new Error('useFocusManagement hook not yet implemented. Will be created in Task 2.');
}

// ===== VERSION INFO =====
export const version = '0.1.0';
export const packageName = '@mind-vitality/ui';

/**
 * Package information
 */
export const packageInfo = {
  name: packageName,
  version,
  description: 'Senior-friendly, accessible React components with WCAG 2.2 AA compliance',
  features: [
    'WCAG 2.2 AA compliant components',
    'Senior-friendly design patterns',
    'Minimum 44x44px tap targets',
    'Audio narration support',
    'High contrast color support',
    'Reduced motion support',
    'Keyboard navigation',
    'Screen reader compatibility'
  ],
} as const;


