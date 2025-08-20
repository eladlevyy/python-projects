import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AudioNarrationProvider } from '@/components/layout/AudioNarrationProvider';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Mind Vitality',
    default: 'Mind Vitality - Brain Exercises for Older Adults',
  },
  description: 'Engaging cognitive training with senior-friendly design. Improve memory, focus, and mental agility through scientifically-backed brain exercises.',
  keywords: [
    'cognitive training',
    'brain exercises', 
    'seniors',
    'memory improvement',
    'mental agility',
    'accessible design'
  ],
  authors: [{ name: 'Mind Vitality Team' }],
  creator: 'Mind Vitality Team',
  publisher: 'Mind Vitality',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mindvitality.com',
    siteName: 'Mind Vitality',
    title: 'Mind Vitality - Brain Exercises for Older Adults',
    description: 'Engaging cognitive training with senior-friendly design. Improve memory, focus, and mental agility through scientifically-backed brain exercises.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mind Vitality - Brain Exercises for Older Adults',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mind Vitality - Brain Exercises for Older Adults',
    description: 'Engaging cognitive training with senior-friendly design.',
    images: ['/og-image.jpg'],
  },
  // PWA metadata
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Mind Vitality',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow up to 5x zoom for accessibility
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} scroll-smooth`}
      // Suppress hydration warnings for theme switching
      suppressHydrationWarning
    >
      <head>
        {/* Preload critical fonts for performance */}
        <link
          rel="preload"
          href="/fonts/inter-latin-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/inter-latin-600.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* High contrast mode detection for accessibility */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (window.matchMedia('(prefers-contrast: high)').matches) {
                  document.documentElement.classList.add('high-contrast');
                }
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                  document.documentElement.classList.add('reduce-motion');
                }
              })();
            `,
          }}
        />
      </head>
      <body 
        className="min-h-screen bg-gray-50 text-gray-900 antialiased font-sans"
        // Skip to main content for screen readers
      >
        {/* Skip to main content link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only-focusable absolute top-4 left-4 z-50 bg-primary-600 text-white px-4 py-2 rounded-md text-lg font-medium focus:not-sr-only"
        >
          Skip to main content
        </a>

        {/* Auth0 authentication provider */}
        <AuthProvider>
          {/* Audio narration context provider */}
          <AudioNarrationProvider>
            {/* Main layout wrapper */}
            <MainLayout>
              <main id="main-content" className="flex-1">
                {children}
              </main>
            </MainLayout>
          </AudioNarrationProvider>
        </AuthProvider>

        {/* Screen reader announcements */}
        <div
          id="screen-reader-announcements"
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
        />
      </body>
    </html>
  );
}


