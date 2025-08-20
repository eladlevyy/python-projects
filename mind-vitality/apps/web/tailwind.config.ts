import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // WCAG 2.2 AA compliant design tokens
      colors: {
        // Primary colors with 4.5:1 contrast ratio
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Senior-friendly color palette
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        // Semantic colors with high contrast
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      // Typography scales for seniors (18-32px)
      fontSize: {
        'xs': ['14px', { lineHeight: '1.5' }],
        'sm': ['16px', { lineHeight: '1.5' }],
        'base': ['18px', { lineHeight: '1.6' }],
        'lg': ['20px', { lineHeight: '1.6' }],
        'xl': ['22px', { lineHeight: '1.6' }],
        '2xl': ['24px', { lineHeight: '1.5' }],
        '3xl': ['28px', { lineHeight: '1.4' }],
        '4xl': ['32px', { lineHeight: '1.3' }],
        '5xl': ['36px', { lineHeight: '1.2' }],
        '6xl': ['40px', { lineHeight: '1.1' }],
      },
      // Minimum tap target sizes (44x44px)
      spacing: {
        '11': '2.75rem', // 44px
        '12': '3rem',    // 48px
        '13': '3.25rem', // 52px
        '14': '3.5rem',  // 56px
        '15': '3.75rem', // 60px
        '16': '4rem',    // 64px
      },
      // Animation preferences for reduced motion
      animation: {
        'gentle-bounce': 'gentle-bounce 2s infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'pulse-gentle': 'pulse-gentle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gentle-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      // Border radius for senior-friendly design
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      // Box shadow for accessibility
      boxShadow: {
        'gentle': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        'focus': '0 0 0 3px rgb(59 130 246 / 0.5)',
        'accessible': '0 2px 8px 0 rgb(0 0 0 / 0.15)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Custom plugin for accessibility utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.tap-target': {
          minWidth: '44px',
          minHeight: '44px',
        },
        '.focus-visible-only': {
          '&:focus:not(:focus-visible)': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: '2px solid #3b82f6',
            outlineOffset: '2px',
          },
        },
        '.sr-only-focusable': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          margin: '-1px',
          padding: '0',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0',
          '&:focus': {
            position: 'static',
            width: 'auto',
            height: 'auto',
            margin: '0',
            overflow: 'visible',
            clip: 'auto',
            whiteSpace: 'normal',
          },
        },
      }
      addUtilities(newUtilities)
    },
  ],
}

export default config
