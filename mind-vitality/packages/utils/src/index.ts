/**
 * Mind Vitality - Shared Utility Functions
 * Senior-friendly utility functions for accessibility and common operations
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ===== CSS CLASS UTILITIES =====
/**
 * Utility function to merge Tailwind CSS classes with clsx
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ===== ACCESSIBILITY UTILITIES =====

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
}

/**
 * Trap focus within a container (useful for modals, dropdowns)
 */
export function trapFocus(container: HTMLElement, event: KeyboardEvent) {
  if (event.key !== 'Tab') return;

  const focusableElements = getFocusableElements(container);
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
  } else {
    // Tab
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}

/**
 * Announce text to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove the element after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Generate ARIA properties for form elements
 */
export function generateAriaProps(options: {
  label?: string;
  description?: string;
  required?: boolean;
  invalid?: boolean;
  errorMessage?: string;
}) {
  const { label, description, required, invalid, errorMessage } = options;
  const ariaProps: Record<string, any> = {};

  if (label) {
    ariaProps['aria-label'] = label;
  }

  if (description) {
    ariaProps['aria-describedby'] = `desc-${Math.random().toString(36).substr(2, 9)}`;
  }

  if (required) {
    ariaProps['aria-required'] = 'true';
  }

  if (invalid) {
    ariaProps['aria-invalid'] = 'true';
    if (errorMessage) {
      ariaProps['aria-errormessage'] = `error-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  return ariaProps;
}

// ===== SENIOR-FRIENDLY UTILITIES =====

/**
 * Format time in a senior-friendly way (e.g., "5 minutes" instead of "5m")
 */
export function formatFriendlyTime(minutes: number): string {
  if (minutes < 1) return 'Less than a minute';
  if (minutes === 1) return '1 minute';
  if (minutes < 60) return `${Math.round(minutes)} minutes`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 1) {
    if (remainingMinutes === 0) return '1 hour';
    if (remainingMinutes === 1) return '1 hour and 1 minute';
    return `1 hour and ${Math.round(remainingMinutes)} minutes`;
  }
  
  if (remainingMinutes === 0) return `${hours} hours`;
  if (remainingMinutes === 1) return `${hours} hours and 1 minute`;
  return `${hours} hours and ${Math.round(remainingMinutes)} minutes`;
}

/**
 * Format numbers in a senior-friendly way with proper separators
 */
export function formatFriendlyNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format percentage in a senior-friendly way
 */
export function formatFriendlyPercentage(value: number, total: number): string {
  const percentage = Math.round((value / total) * 100);
  return `${percentage} percent`;
}

/**
 * Convert score to encouraging message for seniors
 */
export function getEncouragingMessage(score: number, maxScore: number): string {
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 90) return "Excellent work! Your mind is sharp!";
  if (percentage >= 80) return "Great job! You're doing really well!";
  if (percentage >= 70) return "Good work! You're making progress!";
  if (percentage >= 60) return "Nice effort! Keep practicing!";
  if (percentage >= 50) return "You're on the right track! Keep going!";
  return "Every attempt makes you stronger! Try again!";
}

// ===== VALIDATION UTILITIES =====

/**
 * Validate email address with senior-friendly error messages
 */
export function validateEmail(email: string): { isValid: boolean; message: string } {
  if (!email) {
    return { isValid: false, message: 'Please enter your email address' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { 
      isValid: false, 
      message: 'Please enter a valid email address (like: yourname@email.com)' 
    };
  }

  return { isValid: true, message: 'Email looks good!' };
}

/**
 * Validate phone number with senior-friendly error messages
 */
export function validatePhoneNumber(phone: string): { isValid: boolean; message: string } {
  if (!phone) {
    return { isValid: false, message: 'Please enter your phone number' };
  }

  // Remove all non-digit characters for validation
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length < 10) {
    return { 
      isValid: false, 
      message: 'Please enter a complete phone number (10 digits)' 
    };
  }

  if (digits.length > 11) {
    return { 
      isValid: false, 
      message: 'Phone number seems too long. Please check and try again.' 
    };
  }

  return { isValid: true, message: 'Phone number looks good!' };
}

// ===== STRING UTILITIES =====

/**
 * Truncate text with senior-friendly ellipsis
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Convert text to title case in a senior-friendly way
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Remove HTML tags for screen readers
 */
export function stripHtml(html: string): string {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return html.replace(/<[^>]*>/g, '');
  }
  
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}

// ===== DATE UTILITIES =====

/**
 * Format date in a senior-friendly way
 */
export function formatFriendlyDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Get relative time in a senior-friendly way
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 300) return 'A few minutes ago'; // 5 minutes
  if (diffInSeconds < 1800) return 'About 30 minutes ago';
  if (diffInSeconds < 3600) return 'About an hour ago';
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return hours === 1 ? 'About 1 hour ago' : `About ${hours} hours ago`;
  }
  if (diffInSeconds < 604800) { // 7 days
    const days = Math.floor(diffInSeconds / 86400);
    return days === 1 ? 'Yesterday' : `${days} days ago`;
  }

  return formatFriendlyDate(d);
}

// ===== DEVICE DETECTION UTILITIES =====

/**
 * Check if user is on a mobile device
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Check if user is on a tablet device
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

/**
 * Check if user is on a desktop device
 */
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
}

// ===== PERFORMANCE UTILITIES =====

/**
 * Debounce function for senior-friendly interfaces (longer delay)
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait = 500
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for senior-friendly interfaces
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit = 300
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Re-export types for convenience
export type { ClassValue } from 'clsx';
