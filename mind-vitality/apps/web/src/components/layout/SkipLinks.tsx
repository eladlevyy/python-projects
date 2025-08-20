'use client';

// Skip Links component for keyboard navigation accessibility
export function SkipLinks() {
  return (
    <div className="sr-only-focusable">
      <a
        href="#main-content"
        className="absolute top-4 left-4 z-50 bg-primary-600 text-white px-4 py-2 rounded-md text-lg font-medium focus:not-sr-only shadow-focus"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="absolute top-4 left-32 z-50 bg-primary-600 text-white px-4 py-2 rounded-md text-lg font-medium focus:not-sr-only shadow-focus"
      >
        Skip to navigation
      </a>
      <a
        href="#footer"
        className="absolute top-4 left-60 z-50 bg-primary-600 text-white px-4 py-2 rounded-md text-lg font-medium focus:not-sr-only shadow-focus"
      >
        Skip to footer
      </a>
    </div>
  );
}
