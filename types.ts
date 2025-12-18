export enum AppView {
  AUTH = 'AUTH',
  ONBOARDING = 'ONBOARDING',
  HOME = 'HOME',
  PROGRESS = 'PROGRESS',
  HISTORY = 'HISTORY',
  STORE = 'STORE',
  SETTINGS = 'SETTINGS',
}

export enum Domain {
  HEALTH = 'Health',
  LEARNING = 'Learning',
  MENTAL_CLARITY = 'Mental Clarity',
  RELATIONSHIPS = 'Relationships',
  CAREER = 'Career', // Premium
  ORGANIZATION = 'Personal Organization', // Premium
}

export enum TimePreference {
  MORNING = 'Morning',
  AFTERNOON = 'Afternoon',
  EVENING = 'Evening',
  CUSTOM = 'Custom',
  NONE = 'No reminders',
}

export enum DifficultyRating {
  TOO_EASY = 'TOO_EASY',
  JUST_RIGHT = 'JUST_RIGHT',
  BIT_HARD = 'BIT_HARD',
}

export enum Mood {
  CALM = 'CALM',
  HAPPY = 'HAPPY',
  NEUTRAL = 'NEUTRAL',
  TIRED = 'TIRED',
  STRESSED = 'STRESSED',
}

export enum EnergyLevel {
  DEPLETED = 'DEPLETED',
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
}

export type Theme = 'light' | 'dark';
export type ThemeColor = string;

export enum SubscriptionTier {
  FREE = 'FREE',
  WEEKLY_SPROUT = 'WEEKLY_SPROUT', 
  PREMIUM_MONTHLY = 'PREMIUM_MONTHLY',
  PREMIUM_YEARLY = 'PREMIUM_YEARLY',
  LIFETIME = 'LIFETIME',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface PurchasedPack {
  id: string;
  name: string;
  purchasedDate: string;
}

export interface DailyAction {
  id: string;
  date: string;
  title: string;
  description: string;
  durationText: string;
  completed: boolean;
  skipped: boolean;
  isRestDay?: boolean;
  difficultyRating?: DifficultyRating;
  reflection?: string;
  mood?: Mood;
  domain: Domain;
  packId?: string;
  energyLevelAtGeneration?: EnergyLevel;
}

export interface UserState {
  hasOnboarded: boolean;
  selectedDomain: Domain | null;
  timePreference: TimePreference | null;
  reminderTime: string | null; // e.g. "08:30"
  actions: DailyAction[];
  internalDifficultyScore: number;
  joinDate: string;
  subscriptionTier: SubscriptionTier;
  purchasedPacks: PurchasedPack[];
  activePackId: string | null;
  theme: Theme;
  themeColor: ThemeColor;
  isMinimalist: boolean;
  lastActiveDate?: string;
}

export const INITIAL_STATE: UserState = {
  hasOnboarded: false,
  selectedDomain: null,
  timePreference: null,
  reminderTime: "09:00",
  actions: [],
  internalDifficultyScore: 50,
  joinDate: new Date().toISOString(),
  subscriptionTier: SubscriptionTier.FREE,
  purchasedPacks: [],
  activePackId: null,
  theme: 'light',
  themeColor: '#4A5D4E', 
  isMinimalist: false,
};