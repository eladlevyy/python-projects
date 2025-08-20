/**
 * Audio Narration Provider for Mind Vitality
 * Context provider for global audio narration state management
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAudioNarration } from '@/hooks/useAudioNarration';

interface AudioNarrationContextType {
  isSupported: boolean;
  isEnabled: boolean;
  isSpeaking: boolean;
  voices: SpeechSynthesisVoice[];
  currentVoice: SpeechSynthesisVoice | null;
  speak: (text: string, priority?: 'low' | 'normal' | 'high') => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  toggle: () => void;
  setVoice: (voiceName: string) => void;
  announceNavigation: (pageName: string) => void;
  announceError: (error: string) => void;
  announceSuccess: (message: string) => void;
  announceInstruction: (instruction: string) => void;
  announceExerciseStart: (exerciseName: string) => void;
  announceExerciseResult: (isCorrect: boolean, feedback?: string) => void;
  announceProgress: (current: number, total: number) => void;
  announceButtonAction: (action: string) => void;
}

const AudioNarrationContext = createContext<AudioNarrationContextType | null>(null);

interface AudioNarrationProviderProps {
  children: ReactNode;
}

export function AudioNarrationProvider({ children }: AudioNarrationProviderProps) {
  const narration = useAudioNarration({
    rate: 0.8,        // Slower for seniors
    pitch: 1.0,
    volume: 0.8,
    lang: 'en-US',
    autoPlay: true,
  });

  return (
    <AudioNarrationContext.Provider value={narration}>
      {children}
    </AudioNarrationContext.Provider>
  );
}

export function useAudioNarrationContext() {
  const context = useContext(AudioNarrationContext);
  if (!context) {
    throw new Error('useAudioNarrationContext must be used within an AudioNarrationProvider');
  }
  return context;
}
