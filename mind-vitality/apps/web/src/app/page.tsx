'use client';

import { useEffect } from 'react';
import { useAudioNarrationContext } from '@/components/layout/AudioNarrationProvider';

export default function HomePage() {
  const { announceNavigation, speak } = useAudioNarrationContext();

  useEffect(() => {
    // Announce page load for screen readers and audio narration
    announceNavigation('Mind Vitality Home');
  }, [announceNavigation]);

  const handleGetStarted = () => {
    speak('Getting started with Mind Vitality brain exercises', 'normal');
    // TODO: Navigate to onboarding or exercises when implemented
    console.log('Navigate to getting started flow');
  };

  const handleLearnMore = () => {
    speak('Learning more about Mind Vitality', 'normal');
    // TODO: Navigate to about page when implemented
    console.log('Navigate to learn more');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="space-y-8">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            <span className="block">Keep Your Mind</span>
            <span className="block text-primary-600">Sharp & Active</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Engaging brain exercises designed specifically for older adults. 
            Improve memory, focus, and mental agility with our scientifically-backed 
            cognitive training programs.
          </p>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-gentle">
              <div className="text-primary-600 text-3xl mb-4" aria-hidden="true">
                🧠
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Memory Training
              </h3>
              <p className="text-gray-700">
                Strengthen recall and retention with proven memory techniques
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-gentle">
              <div className="text-primary-600 text-3xl mb-4" aria-hidden="true">
                🎯
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Focus Enhancement
              </h3>
              <p className="text-gray-700">
                Improve concentration and attention span through targeted exercises
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-gentle">
              <div className="text-primary-600 text-3xl mb-4" aria-hidden="true">
                ♿
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Accessible Design
              </h3>
              <p className="text-gray-700">
                Large text, high contrast, and audio support for everyone
              </p>
            </div>
          </div>

          {/* One Action Per Screen - Primary CTA */}
          <div className="space-y-4">
            <button
              onClick={handleGetStarted}
              className="tap-target bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-semibold text-xl px-12 py-6 rounded-2xl shadow-accessible hover:shadow-lg transition-all duration-200 focus-visible-only transform hover:scale-105 active:scale-95"
              aria-describedby="get-started-description"
            >
              Start Brain Training Today
            </button>
            
            {/* Hidden description for screen readers */}
            <p id="get-started-description" className="sr-only">
              Begin your cognitive training journey with exercises designed for older adults
            </p>

            {/* Secondary action - less prominent */}
            <div className="mt-6">
              <button
                onClick={handleLearnMore}
                className="tap-target text-primary-700 hover:text-primary-800 font-medium text-lg px-6 py-3 rounded-xl hover:bg-primary-50 transition-all duration-200 focus-visible-only"
                aria-describedby="learn-more-description"
              >
                Learn More About Our Approach
              </button>
              
              {/* Hidden description for screen readers */}
              <p id="learn-more-description" className="sr-only">
                Discover the science and methodology behind our brain training programs
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-gray-600 font-medium mb-4">
              Trusted by healthcare professionals and seniors worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-sm font-medium text-gray-500">
                Scientifically Validated
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full" aria-hidden="true"></div>
              <div className="text-sm font-medium text-gray-500">
                WCAG 2.2 AA Compliant
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full" aria-hidden="true"></div>
              <div className="text-sm font-medium text-gray-500">
                Senior-Friendly Design
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Audio Controls Indicator */}
      <div className="fixed bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-accessible">
        <div className="flex items-center gap-2">
          <div className="text-primary-600" aria-hidden="true">🔊</div>
          <span className="text-sm font-medium text-gray-700 sr-only md:not-sr-only">
            Audio Support Active
          </span>
        </div>
      </div>
    </div>
  );
}
