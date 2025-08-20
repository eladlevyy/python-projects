/**
 * Header Component for Mind Vitality
 * Senior-friendly header with large controls and audio narration
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAudioNarration } from '@/hooks/useAudioNarration';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Logo } from '@/components/ui/Logo';

interface HeaderProps {
  title?: string;
  showNavigation?: boolean;
  className?: string;
}

export function Header({ 
  title = 'Mind Vitality', 
  showNavigation = true,
  className = '' 
}: HeaderProps) {
  const { toggle: toggleNarration, isEnabled: narrationEnabled } = useAudioNarration();

  const handleNarrationToggle = () => {
    toggleNarration();
  };

  return (
    <header 
      role="banner"
      className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Logo className="h-8 w-8 md:h-10 md:w-10" />
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                Brain exercises for older adults
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Audio Narration Toggle */}
            <IconButton
              variant="ghost"
              size="lg"
              onClick={handleNarrationToggle}
              aria-label={narrationEnabled ? 'Turn off audio narration' : 'Turn on audio narration'}
              className="tap-target focus-visible-only"
            >
              <AudioIcon enabled={narrationEnabled} className="h-5 w-5 md:h-6 md:w-6" />
            </IconButton>

            {/* Accessibility Panel Toggle */}
            <IconButton
              variant="ghost"
              size="lg"
              onClick={() => {
                // This will be connected to accessibility panel
                document.dispatchEvent(new CustomEvent('toggle-accessibility-panel'));
              }}
              aria-label="Open accessibility settings"
              className="tap-target focus-visible-only"
            >
              <AccessibilityIcon className="h-5 w-5 md:h-6 md:w-6" />
            </IconButton>

            {/* User Profile/Menu */}
            <Button
              variant="outline"
              size="lg"
              className="tap-target focus-visible-only hidden sm:flex"
              aria-label="Open user menu"
            >
              <UserIcon className="h-5 w-5 md:h-6 md:w-6 mr-2" />
              <span className="hidden md:inline">Profile</span>
            </Button>

            {/* Mobile Menu Button */}
            {showNavigation && (
              <IconButton
                variant="ghost"
                size="lg"
                className="tap-target focus-visible-only sm:hidden"
                aria-label="Open navigation menu"
                onClick={() => {
                  document.dispatchEvent(new CustomEvent('toggle-mobile-nav'));
                }}
              >
                <MenuIcon className="h-6 w-6" />
              </IconButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Audio Icon Component
function AudioIcon({ enabled, className }: { enabled: boolean; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      {enabled ? (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.5c-.69 0-1.25-.56-1.25-1.25V9.75c0-.69.56-1.25 1.25-1.25h2.25z" />
        </>
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.5c-.69 0-1.25-.56-1.25-1.25V9.75c0-.69.56-1.25 1.25-1.25h2.25z" />
        </>
      )}
    </svg>
  );
}

// Accessibility Icon Component
function AccessibilityIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

// User Icon Component
function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

// Menu Icon Component  
function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}
