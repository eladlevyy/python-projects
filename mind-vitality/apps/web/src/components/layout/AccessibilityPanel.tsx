'use client';

import { useState } from 'react';

// Accessibility Panel component for senior-friendly settings
// Will be fully implemented in a future task
export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Accessibility panel trigger - hidden by default, accessible via keyboard */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sr-only-focusable fixed top-20 right-4 z-40 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium"
        aria-label="Open accessibility settings"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        Accessibility Settings
      </button>

      {/* Accessibility panel */}
      {isOpen && (
        <div
          id="accessibility-panel"
          className="fixed top-32 right-4 z-40 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64"
          role="dialog"
          aria-label="Accessibility Settings"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Accessibility Settings
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Accessibility panel will be fully implemented in a future task.
          </p>
          <button
            onClick={() => setIsOpen(false)}
            className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
