/**
 * Accessibility Utilities and ARIA Helpers for Mind Vitality
 * Senior-friendly accessibility features for cognitive training app
 */

import { RefObject, useEffect, useRef, useState } from 'react';

// ARIA live regions for dynamic content announcements
export type AriaLiveRegion = 'off' | 'polite' | 'assertive';

// Screen reader announcement utility
export class ScreenReaderAnnouncer {
  private static instance: ScreenReaderAnnouncer;
  private politeRegion: HTMLElement | null = null;
  private assertiveRegion: HTMLElement | null = null;

  static getInstance(): ScreenReaderAnnouncer {
    if (!ScreenReaderAnnouncer.instance) {
      ScreenReaderAnnouncer.instance = new ScreenReaderAnnouncer();
    }
    return ScreenReaderAnnouncer.instance;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.createLiveRegions();
    }
  }

  private createLiveRegions() {
    // Polite live region for non-urgent announcements
    if (!this.politeRegion) {
      this.politeRegion = document.createElement('div');
      this.politeRegion.setAttribute('aria-live', 'polite');
      this.politeRegion.setAttribute('aria-atomic', 'true');
      this.politeRegion.setAttribute('class', 'sr-only');
      this.politeRegion.style.cssText = `
        position: absolute !important;
        left: -10000px !important;
        top: auto !important;
        width: 1px !important;
        height: 1px !important;
        overflow: hidden !important;
      `;
      document.body.appendChild(this.politeRegion);
    }

    // Assertive live region for urgent announcements
    if (!this.assertiveRegion) {
      this.assertiveRegion = document.createElement('div');
      this.assertiveRegion.setAttribute('aria-live', 'assertive');
      this.assertiveRegion.setAttribute('aria-atomic', 'true');
      this.assertiveRegion.setAttribute('class', 'sr-only');
      this.assertiveRegion.style.cssText = `
        position: absolute !important;
        left: -10000px !important;
        top: auto !important;
        width: 1px !important;
        height: 1px !important;
        overflow: hidden !important;
      `;
      document.body.appendChild(this.assertiveRegion);
    }
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const region = priority === 'assertive' ? this.assertiveRegion : this.politeRegion;
    if (region) {
      // Clear and then set the message to ensure it's announced
      region.textContent = '';
      setTimeout(() => {
        region.textContent = message;
      }, 100);
    }
  }

  // Announce exercise instructions
  announceExerciseInstruction(instruction: string) {
    this.announce(`Exercise instruction: ${instruction}`, 'polite');
  }

  // Announce exercise results
  announceExerciseResult(result: string, isCorrect: boolean) {
    const message = `Exercise result: ${result}. ${isCorrect ? 'Correct!' : 'Try again.'}`;
    this.announce(message, 'polite');
  }

  // Announce navigation changes
  announceNavigation(pageName: string) {
    this.announce(`Navigated to ${pageName}`, 'polite');
  }

  // Announce errors
  announceError(error: string) {
    this.announce(`Error: ${error}`, 'assertive');
  }

  // Announce success messages
  announceSuccess(message: string) {
    this.announce(`Success: ${message}`, 'polite');
  }
}

// Hook for using screen reader announcements
export function useScreenReader() {
  const announcer = ScreenReaderAnnouncer.getInstance();
  
  return {
    announce: announcer.announce.bind(announcer),
    announceInstruction: announcer.announceExerciseInstruction.bind(announcer),
    announceResult: announcer.announceExerciseResult.bind(announcer),
    announceNavigation: announcer.announceNavigation.bind(announcer),
    announceError: announcer.announceError.bind(announcer),
    announceSuccess: announcer.announceSuccess.bind(announcer),
  };
}

// Focus management utilities
export class FocusManager {
  private static focusHistory: HTMLElement[] = [];

  // Trap focus within a container (for modals, menus)
  static trapFocus(container: HTMLElement) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Focus the first element
    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }

  // Save current focus for restoration
  static saveFocus() {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      this.focusHistory.push(activeElement);
    }
  }

  // Restore previously saved focus
  static restoreFocus() {
    const lastFocused = this.focusHistory.pop();
    if (lastFocused && lastFocused.focus) {
      lastFocused.focus();
    }
  }

  // Focus first focusable element in container
  static focusFirst(container: HTMLElement) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }
}

// Hook for focus management
export function useFocusManagement() {
  return {
    trapFocus: FocusManager.trapFocus,
    saveFocus: FocusManager.saveFocus,
    restoreFocus: FocusManager.restoreFocus,
    focusFirst: FocusManager.focusFirst,
  };
}

// Keyboard navigation utilities
export function useKeyboardNavigation(
  containerRef: RefObject<HTMLElement>,
  onEscape?: () => void,
  onEnter?: () => void
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onEscape?.();
          break;
        case 'Enter':
        case ' ':
          if (e.target === container) {
            onEnter?.();
            e.preventDefault();
          }
          break;
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, onEscape, onEnter]);
}

// Skip link utilities
export function createSkipLink(targetId: string, label: string): HTMLElement {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = label;
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    left: -9999px;
    z-index: 999;
    padding: 8px 16px;
    background-color: #2563eb;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
  `;

  // Show on focus
  skipLink.addEventListener('focus', () => {
    skipLink.style.left = '8px';
    skipLink.style.top = '8px';
  });

  skipLink.addEventListener('blur', () => {
    skipLink.style.left = '-9999px';
  });

  return skipLink;
}

// Reduced motion detection
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// High contrast detection
export function useHighContrast() {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = () => setPrefersHighContrast(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
}

// ARIA attributes helpers
export const ariaHelpers = {
  // Generate unique IDs for ARIA relationships
  generateId: (prefix: string = 'aria-element'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Create ARIA label for exercise instructions
  exerciseInstructionProps: (instruction: string, step?: number, total?: number) => ({
    'aria-label': step && total 
      ? `Step ${step} of ${total}: ${instruction}`
      : instruction,
    role: 'region' as const,
    'aria-live': 'polite' as const,
  }),

  // Create ARIA label for exercise buttons
  exerciseButtonProps: (action: string, disabled?: boolean) => ({
    'aria-label': `${action}${disabled ? ' (disabled)' : ''}`,
    'aria-disabled': disabled || undefined,
    role: 'button' as const,
  }),

  // Create ARIA label for progress indicators
  progressProps: (current: number, total: number, label?: string) => ({
    role: 'progressbar' as const,
    'aria-valuenow': current,
    'aria-valuemin': 0,
    'aria-valuemax': total,
    'aria-label': label || `Progress: ${current} of ${total}`,
  }),

  // Create ARIA label for form fields with errors
  formFieldProps: (
    label: string,
    error?: string,
    description?: string,
    required?: boolean
  ) => {
    const describedBy = [];
    if (description) describedBy.push(`${label.toLowerCase().replace(/\s+/g, '-')}-description`);
    if (error) describedBy.push(`${label.toLowerCase().replace(/\s+/g, '-')}-error`);

    return {
      'aria-label': label,
      'aria-required': required || undefined,
      'aria-invalid': !!error || undefined,
      'aria-describedby': describedBy.length > 0 ? describedBy.join(' ') : undefined,
    };
  },

  // Create ARIA label for tabs
  tabProps: (label: string, isSelected: boolean, tabId: string, panelId: string) => ({
    role: 'tab' as const,
    'aria-selected': isSelected,
    'aria-controls': panelId,
    id: tabId,
    tabIndex: isSelected ? 0 : -1,
    'aria-label': label,
  }),

  // Create ARIA label for tab panels
  tabPanelProps: (label: string, tabId: string, panelId: string) => ({
    role: 'tabpanel' as const,
    'aria-labelledby': tabId,
    id: panelId,
    'aria-label': label,
  }),
};

// Contrast ratio calculation utility
export function calculateContrastRatio(color1: string, color2: string): number {
  // Convert hex to RGB
  function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Calculate relative luminance
  function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

// Validate WCAG contrast compliance
export function isWCAGCompliant(
  color1: string, 
  color2: string, 
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = calculateContrastRatio(color1, color2);
  
  if (level === 'AA') {
    return size === 'large' ? ratio >= 3 : ratio >= 4.5;
  } else {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
}

// Export announcer instance for global use
export const screenReader = ScreenReaderAnnouncer.getInstance();
