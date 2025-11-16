/**
 * Main Layout Component for Mind Vitality
 * Senior-friendly layout with accessibility features and audio narration
 */

'use client';

import React, { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { NavigationBar } from './NavigationBar';
import { Footer } from './Footer';
import { SkipLinks } from './SkipLinks';
import { AudioNarrationProvider } from './AudioNarrationProvider';
import { AccessibilityPanel } from './AccessibilityPanel';
import { useAudioNarration } from '@/hooks/useAudioNarration';
import { useReducedMotion } from '@/utils/accessibility';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showNavigation?: boolean;
  showFooter?: boolean;
  className?: string;
}

export function MainLayout({
  children,
  title = 'Mind Vitality',
  description = 'Brain exercises for older adults',
  showNavigation = true,
  showFooter = true,
  className = '',
}: MainLayoutProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const { announceNavigation } = useAudioNarration();

  // Announce page changes for screen readers
  useEffect(() => {
    const pageName = getPageName(pathname);
    announceNavigation(pageName);
  }, [pathname, announceNavigation]);

  // Animation variants for page transitions
  const pageVariants = {
    initial: prefersReducedMotion ? {} : { 
      opacity: 0, 
      y: 8 
    },
    in: { 
      opacity: 1, 
      y: 0 
    },
    out: prefersReducedMotion ? {} : { 
      opacity: 0, 
      y: -8 
    },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: prefersReducedMotion ? 0 : 0.3,
  };

  return (
    <AudioNarrationProvider>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
        {/* Skip Links for keyboard navigation */}
        <SkipLinks />

        {/* Accessibility Panel - Hidden by default, accessible via keyboard */}
        <AccessibilityPanel />

        {/* Header with branding and user controls */}
        <Header title={title} />

        {/* Main navigation */}
        {showNavigation && <NavigationBar />}

        {/* Main content with page transitions */}
        <main 
          id="main-content"
          role="main"
          aria-label="Main content"
          className="flex-1 focus:outline-none"
          tabIndex={-1}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Page title for screen readers */}
            <h1 className="sr-only">{title} - {description}</h1>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="min-h-[calc(100vh-12rem)]"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Footer with links and compliance info */}
        {showFooter && <Footer />}
      </div>
    </AudioNarrationProvider>
  );
}

// Helper function to get readable page name from pathname
function getPageName(pathname: string): string {
  const pathMap: Record<string, string> = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/exercises': 'Exercises',
    '/progress': 'Progress',
    '/profile': 'Profile',
    '/care-circle': 'Care Circle',
    '/onboarding': 'Getting Started',
    '/assessment': 'Assessment',
    '/facility': 'Facility Dashboard',
    '/privacy': 'Privacy Center',
    '/claims': 'Claims Policy',
    '/terms': 'Terms of Service',
    '/accessibility': 'Accessibility Statement',
  };

  return pathMap[pathname] || pathname.split('/').pop()?.replace('-', ' ') || 'Page';
}

// Layout wrapper for specific page types
export function ExerciseLayout({ children }: { children: ReactNode }) {
  return (
    <MainLayout 
      showNavigation={false} 
      showFooter={false}
      className="bg-white dark:bg-gray-800" // Clean background for exercises
    >
      <div className="relative h-screen flex flex-col">
        {children}
      </div>
    </MainLayout>
  );
}

// Layout wrapper for onboarding flow
export function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <MainLayout 
      showNavigation={false}
      className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800"
    >
      <div className="max-w-4xl mx-auto py-8">
        {children}
      </div>
    </MainLayout>
  );
}

// Layout wrapper for facility dashboard
export function FacilityLayout({ children }: { children: ReactNode }) {
  return (
    <MainLayout 
      title="Facility Dashboard - Mind Vitality"
      description="Manage residents and view engagement metrics"
    >
      <div className="space-y-8">
        {children}
      </div>
    </MainLayout>
  );
}
