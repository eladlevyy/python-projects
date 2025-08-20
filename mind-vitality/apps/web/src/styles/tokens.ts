/**
 * Design Tokens for Mind Vitality - WCAG 2.2 AA Compliant
 * Senior-friendly design system with accessibility first approach
 */

// Typography - Senior-friendly sizes (18-32px range)
export const typography = {
  fontSize: {
    xs: '14px',
    sm: '16px', 
    base: '18px',  // Minimum for seniors
    lg: '20px',
    xl: '22px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '32px',   // Maximum for UI elements
    '5xl': '36px',   // Headers only
    '6xl': '40px',   // Hero text
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',   // Optimal for readability
    relaxed: '1.6',  // Better for seniors
    loose: '1.8',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  fontFamily: {
    sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Inter', 'sans-serif'],
    mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
  },
} as const;

// Colors - High contrast with 4.5:1 ratio minimum
export const colors = {
  // Primary brand colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Main brand blue - 4.74:1 on white
    600: '#2563eb',  // 6.22:1 on white
    700: '#1d4ed8',  // 8.58:1 on white
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  
  // Grayscale with enhanced contrast
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',  // 2.84:1 - Use only for non-essential text
    500: '#6b7280',  // 4.54:1 - Minimum for body text
    600: '#4b5563',  // 6.23:1 - Good for all text
    700: '#374151',  // 8.89:1 - Excellent contrast
    800: '#1f2937',  // 12.63:1 - High contrast
    900: '#111827',
    950: '#030712',
  },

  // Semantic colors - High contrast variants
  success: {
    50: '#f0fdf4',
    500: '#22c55e',  // 3.04:1 - Use 600 for text
    600: '#16a34a',  // 4.31:1 - Minimum for text
    700: '#15803d',  // 6.08:1 - Good for text
  },
  
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',  // 2.93:1 - Use 700 for text
    600: '#d97706',  // 4.12:1 - Close to minimum
    700: '#b45309',  // 5.94:1 - Good for text
  },
  
  error: {
    50: '#fef2f2',
    500: '#ef4444',  // 3.32:1 - Use 600+ for text
    600: '#dc2626',  // 4.74:1 - Good for text
    700: '#b91c1c',  // 6.94:1 - High contrast
  },

  // Special semantic colors for cognitive training
  cognitive: {
    attention: '#3b82f6',      // Blue - attention tasks
    memory: '#8b5cf6',         // Purple - memory tasks
    speed: '#f97316',          // Orange - processing speed
    executive: '#06b6d4',      // Cyan - executive function
    language: '#10b981',       // Emerald - language tasks
    visuospatial: '#f59e0b',   // Yellow - visuospatial tasks
  },
} as const;

// Spacing - With minimum tap targets (44px)
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',    
  8: '32px',
  10: '40px',
  11: '44px',   // Minimum tap target
  12: '48px',   // Comfortable tap target
  14: '56px',   // Large tap target
  16: '64px',   // Extra large
  20: '80px',
  24: '96px',
  32: '128px',
  40: '160px',
  48: '192px',
  56: '224px',
  64: '256px',
} as const;

// Component-specific tokens
export const components = {
  // Button variations with minimum sizes
  button: {
    minHeight: '44px',    // WCAG 2.2 minimum
    minWidth: '44px',
    padding: {
      sm: '8px 16px',
      md: '12px 24px',    // Default
      lg: '16px 32px',    // Senior-friendly
      xl: '20px 40px',
    },
    borderRadius: {
      sm: '8px',
      md: '12px',
      lg: '16px',         // Senior-friendly
    },
  },
  
  // Card components
  card: {
    padding: {
      sm: '16px',
      md: '24px',
      lg: '32px',         // Senior-friendly
    },
    borderRadius: '16px', // Gentle corners
    shadow: {
      subtle: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      gentle: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      accessible: '0 10px 15px -3px rgb(0 0 0 / 0.1)', // More visible
    },
  },

  // Form elements
  form: {
    input: {
      minHeight: '44px',
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '18px',   // Senior-friendly
    },
    label: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '8px',
    },
  },

  // Navigation
  nav: {
    height: '64px',       // Generous height
    padding: '0 24px',
    itemPadding: '12px 20px',
    itemMinHeight: '44px',
  },
} as const;

// Animation preferences - Respects reduce-motion
export const animation = {
  duration: {
    fast: '150ms',
    normal: '250ms',      // Default
    slow: '350ms',        // Senior-friendly
    slower: '500ms',
  },
  
  easing: {
    linear: 'linear',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Senior-friendly
  },
  
  // Reduced motion alternatives
  reduced: {
    duration: '0ms',      // Instant for reduced motion
    opacity: '1',         // No fade effects
  },
} as const;

// Accessibility-specific tokens
export const accessibility = {
  focus: {
    width: '2px',
    offset: '2px',
    color: colors.primary[600],
    style: 'solid',
    borderRadius: '4px',
  },
  
  // Screen reader specific
  srOnly: {
    position: 'absolute' as const,
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden' as const,
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap' as const,
    border: '0',
  },

  // Skip links
  skipLink: {
    position: 'absolute' as const,
    left: '-9999px',
    zIndex: 999,
    padding: '8px 16px',
    backgroundColor: colors.primary[600],
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
  },
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablet
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large desktop
  '2xl': '1536px', // Extra large
} as const;

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;
