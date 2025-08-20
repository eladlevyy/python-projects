/**
 * Mind Vitality - Shared TypeScript Types and Interfaces
 * Senior-friendly cognitive training application types
 */

// ===== AUTHENTICATION TYPES =====
export interface User {
  id: string;
  email: string;
  name?: string;
  dateOfBirth?: string;
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// ===== ACCESSIBILITY TYPES =====
export interface AudioNarrationSettings {
  isEnabled: boolean;
  rate: number;
  pitch: number;
  volume: number;
  voice?: string;
  autoAnnounce: boolean;
}

export interface AccessibilitySettings {
  audioNarration: AudioNarrationSettings;
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  keyboardNavigation: boolean;
}

export type AudioPriority = 'low' | 'normal' | 'high';

export interface AudioNarrationContext {
  isSupported: boolean;
  isEnabled: boolean;
  isSpeaking: boolean;
  voices: SpeechSynthesisVoice[];
  currentVoice: SpeechSynthesisVoice | null;
  speak: (text: string, priority?: AudioPriority) => void;
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

// ===== UI COMPONENT TYPES =====
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type IconButtonVariant = 'primary' | 'secondary' | 'ghost';
export type LogoVariant = 'icon' | 'text' | 'full';

export interface ButtonProps {
  children: any; // ReactNode equivalent without React dependency
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export interface IconButtonProps {
  children: any; // ReactNode equivalent without React dependency
  onClick?: () => void;
  'aria-label': string;
  variant?: IconButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
}

export interface LogoProps {
  size?: ButtonSize;
  variant?: LogoVariant;
  className?: string;
}

// ===== EXERCISE TYPES =====
export type ExerciseType = 'memory' | 'attention' | 'processing' | 'executive';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type ExerciseStatus = 'not_started' | 'in_progress' | 'completed' | 'abandoned';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  type: ExerciseType;
  difficulty: DifficultyLevel;
  estimatedDuration: number; // in minutes
  instructions: string[];
  isAccessible: boolean;
  hasAudioSupport: boolean;
  minTapTargetSize: number; // in pixels
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseSession {
  id: string;
  exerciseId: string;
  userId: string;
  status: ExerciseStatus;
  startedAt: string;
  completedAt?: string;
  score?: number;
  timeSpent: number; // in seconds
  responses: ExerciseResponse[];
}

export interface ExerciseResponse {
  questionId: string;
  userAnswer: any;
  correctAnswer: any;
  isCorrect: boolean;
  responseTime: number; // in milliseconds
  timestamp: string;
}

// ===== PROGRESS TRACKING TYPES =====
export interface ProgressStats {
  totalSessions: number;
  completedExercises: number;
  averageScore: number;
  totalTimeSpent: number; // in minutes
  currentStreak: number; // days
  longestStreak: number; // days
  improvementTrend: 'improving' | 'stable' | 'declining';
  lastActivityDate: string;
}

export interface ExerciseStats {
  exerciseId: string;
  exerciseName: string;
  totalAttempts: number;
  bestScore: number;
  averageScore: number;
  averageTime: number; // in seconds
  lastAttemptDate: string;
  improvementPercentage: number;
}

// ===== ERROR HANDLING TYPES =====
export interface AppError {
  code: string;
  message: string;
  userMessage: string; // Senior-friendly explanation
  timestamp: string;
  context?: Record<string, any>;
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// ===== API RESPONSE TYPES =====
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: AppError;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// ===== LAYOUT TYPES =====
export interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showNavigation?: boolean;
  showFooter?: boolean;
  className?: string;
}

export interface HeaderProps {
  title?: string;
  showUserMenu?: boolean;
  className?: string;
}

// ===== UTILITY TYPES =====
export type Theme = 'light' | 'dark' | 'high-contrast';
export type Language = 'en' | 'es' | 'fr' | 'de';

export interface AppSettings {
  theme: Theme;
  language: Language;
  accessibility: AccessibilitySettings;
  notifications: boolean;
  autoSave: boolean;
}

// Re-export commonly used React types for convenience
export type { ReactNode, ReactElement, ComponentProps } from 'react';

