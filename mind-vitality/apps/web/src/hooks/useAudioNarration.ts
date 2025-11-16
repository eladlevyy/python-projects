/**
 * Audio Narration Hook for Mind Vitality
 * Provides text-to-speech functionality for senior-friendly accessibility
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/utils/accessibility';

interface AudioNarrationOptions {
  rate?: number;        // Speech rate (0.1-10, default 0.8 for seniors)
  pitch?: number;       // Speech pitch (0-2, default 1)
  volume?: number;      // Speech volume (0-1, default 0.8)
  voice?: string;       // Preferred voice name
  lang?: string;        // Language code (default 'en-US')
  autoPlay?: boolean;   // Auto-play announcements
}

interface NarrationState {
  isSupported: boolean;
  isEnabled: boolean;
  isSpeaking: boolean;
  voices: SpeechSynthesisVoice[];
  currentVoice: SpeechSynthesisVoice | null;
  queue: string[];
}

const DEFAULT_OPTIONS: Required<AudioNarrationOptions> = {
  rate: 0.8,          // Slower for seniors
  pitch: 1.0,
  volume: 0.8,
  voice: '',
  lang: 'en-US',
  autoPlay: true,
};

export function useAudioNarration(options: AudioNarrationOptions = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const prefersReducedMotion = useReducedMotion();
  
  const [state, setState] = useState<NarrationState>({
    isSupported: false,
    isEnabled: false,
    isSpeaking: false,
    voices: [],
    currentVoice: null,
    queue: [],
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis;
      
      setState(prev => ({
        ...prev,
        isSupported: true,
        isEnabled: !prefersReducedMotion, // Respect reduced motion preference
      }));

      // Load available voices
      const loadVoices = () => {
        const voices = speechSynthRef.current?.getVoices() || [];
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith(config.lang) && 
          (config.voice === '' || voice.name.includes(config.voice))
        ) || voices.find(voice => voice.lang.startsWith(config.lang)) || voices[0];

        setState(prev => ({
          ...prev,
          voices,
          currentVoice: preferredVoice || null,
        }));
      };

      // Load voices immediately and on voices changed
      loadVoices();
      if (speechSynthRef.current) {
        speechSynthRef.current.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (speechSynthRef.current) {
        speechSynthRef.current.onvoiceschanged = null;
      }
    };
  }, [config.lang, config.voice, prefersReducedMotion]);

  // Speak text with options
  const speak = useCallback(
    (text: string, priority: 'low' | 'normal' | 'high' = 'normal') => {
      if (!state.isSupported || !state.isEnabled || !speechSynthRef.current) {
        return;
      }

      // Cancel current speech if high priority
      if (priority === 'high') {
        speechSynthRef.current.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = config.rate;
      utterance.pitch = config.pitch;
      utterance.volume = config.volume;
      utterance.lang = config.lang;

      if (state.currentVoice) {
        utterance.voice = state.currentVoice;
      }

      utterance.onstart = () => {
        setState(prev => ({ ...prev, isSpeaking: true }));
      };

      utterance.onend = () => {
        setState(prev => ({ ...prev, isSpeaking: false }));
      };

      utterance.onerror = () => {
        setState(prev => ({ ...prev, isSpeaking: false }));
        console.warn('Speech synthesis error occurred');
      };

      utteranceRef.current = utterance;
      speechSynthRef.current.speak(utterance);
    },
    [state.isSupported, state.isEnabled, state.currentVoice, config]
  );

  // Stop current speech
  const stop = useCallback(() => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, []);

  // Pause current speech
  const pause = useCallback(() => {
    if (speechSynthRef.current && state.isSpeaking) {
      speechSynthRef.current.pause();
    }
  }, [state.isSpeaking]);

  // Resume paused speech
  const resume = useCallback(() => {
    if (speechSynthRef.current) {
      speechSynthRef.current.resume();
    }
  }, []);

  // Toggle narration on/off
  const toggle = useCallback(() => {
    setState(prev => {
      const newEnabled = !prev.isEnabled;
      if (!newEnabled && speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
      return { ...prev, isEnabled: newEnabled, isSpeaking: false };
    });
  }, []);

  // Change voice
  const setVoice = useCallback((voiceName: string) => {
    const voice = state.voices.find(v => v.name === voiceName);
    if (voice) {
      setState(prev => ({ ...prev, currentVoice: voice }));
    }
  }, [state.voices]);

  // Predefined messages for common UI interactions
  const announceNavigation = useCallback((pageName: string) => {
    speak(`Navigated to ${pageName} page`, 'normal');
  }, [speak]);

  const announceError = useCallback((error: string) => {
    speak(`Error: ${error}`, 'high');
  }, [speak]);

  const announceSuccess = useCallback((message: string) => {
    speak(`Success: ${message}`, 'normal');
  }, [speak]);

  const announceInstruction = useCallback((instruction: string) => {
    speak(`Instruction: ${instruction}`, 'normal');
  }, [speak]);

  const announceExerciseStart = useCallback((exerciseName: string) => {
    speak(`Starting ${exerciseName} exercise. Listen for instructions.`, 'normal');
  }, [speak]);

  const announceExerciseResult = useCallback((isCorrect: boolean, feedback?: string) => {
    const message = isCorrect ? 'Correct!' : 'Try again.';
    speak(feedback ? `${message} ${feedback}` : message, 'normal');
  }, [speak]);

  const announceProgress = useCallback((current: number, total: number) => {
    speak(`Progress: ${current} of ${total} complete`, 'low');
  }, [speak]);

  const announceButtonAction = useCallback((action: string) => {
    speak(action, 'low');
  }, [speak]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);

  return {
    // State
    isSupported: state.isSupported,
    isEnabled: state.isEnabled,
    isSpeaking: state.isSpeaking,
    voices: state.voices,
    currentVoice: state.currentVoice,

    // Controls
    speak,
    stop,
    pause,
    resume,
    toggle,
    setVoice,

    // Convenience methods
    announceNavigation,
    announceError,
    announceSuccess,
    announceInstruction,
    announceExerciseStart,
    announceExerciseResult,
    announceProgress,
    announceButtonAction,
  };
}
