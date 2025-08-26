// User and Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  totalXP: number;
  level: number;
  currentStreak: number;
  bestStreak: number;
  achievements: Achievement[];
  promptHistory: PromptAnalysisResult[];
}

export interface GuestUser {
  isGuest: true;
  sessionId: string;
  tempPromptHistory: PromptAnalysisResult[];
}

export type UserType = User | GuestUser;

// Authentication
export interface AuthContextType {
  user: UserType | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isGuest: boolean;
}

// Prompt Analysis Types
export interface PromptAnalysis {
  score: number; // 0-100
  tokenCount: number;
  isNearLimit: boolean;
  isAtLimit: boolean;
  feedback: PromptFeedback;
  suggestions: string[];
  category: PromptCategory;
  quality: PromptQuality;
}

export interface PromptFeedback {
  clarity: number; // 0-100
  specificity: number; // 0-100
  context: number; // 0-100
  structure: number; // 0-100
  length: number; // 0-100
}

export interface PromptAnalysisResult {
  id: string;
  prompt: string;
  analysis: PromptAnalysis;
  timestamp: Date;
  xpEarned: number;
  achievementsUnlocked: Achievement[];
}

export enum PromptCategory {
  CREATIVE = 'creative',
  TECHNICAL = 'technical',
  ANALYTICAL = 'analytical',
  CONVERSATIONAL = 'conversational',
  INSTRUCTIONAL = 'instructional',
  CODING = 'coding'
}

export enum PromptQuality {
  POOR = 'poor',
  FAIR = 'fair', 
  GOOD = 'good',
  EXCELLENT = 'excellent',
  PERFECT = 'perfect'
}

// Achievement System Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  category: AchievementCategory;
  rarity: AchievementRarity;
  xpReward: number;
}

export enum AchievementCategory {
  QUALITY = 'quality',
  CONSISTENCY = 'consistency',
  IMPROVEMENT = 'improvement',
  EXPLORATION = 'exploration',
  MASTERY = 'mastery'
}

export enum AchievementRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

// Gamification Types
export interface UserProgress {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  currentStreak: number;
  bestStreak: number;
  promptsAnalyzed: number;
  averageScore: number;
  improvements: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  level: number;
  totalXP: number;
  achievements: number;
  rank: number;
}

// Example Types
export interface PromptExample {
  id: string;
  category: PromptCategory;
  title: string;
  poorExample: {
    prompt: string;
    issues: string[];
    score: number;
  };
  goodExample: {
    prompt: string;
    improvements: string[];
    score: number;
  };
  explanation: string;
  tips: string[];
}

// UI Component Types
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Local Storage Types
export interface StoredUserData {
  user: User;
  lastLogin: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  animations: boolean;
  soundEffects: boolean;
  notifications: boolean;
  autoAnalyze: boolean;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Constants
export const TOKEN_LIMITS = {
  GPT4: 8192,
  GPT3_5: 4096,
  CLAUDE: 100000,
  WARNING_THRESHOLD: 0.8, // 80% of limit
  ERROR_THRESHOLD: 0.95    // 95% of limit
} as const;

export const XP_REWARDS = {
  PROMPT_ANALYSIS: 10,
  PERFECT_SCORE: 50,
  ACHIEVEMENT_UNLOCK: 25,
  DAILY_STREAK: 15,
  CATEGORY_MASTER: 100
} as const;

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000, 17500
] as const;