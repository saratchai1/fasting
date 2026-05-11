export type Sex = "female" | "male" | "other";

export type FastingGoal =
  | "fat_loss"
  | "health"
  | "metabolic_health"
  | "discipline"
  | "other";

export type FastingExperience = "beginner" | "intermediate" | "advanced";

export type ExerciseIntensity = "none" | "light" | "moderate" | "heavy";

export type MenstrualPhase =
  | "none"
  | "period_day_1_2"
  | "period_day_3_plus"
  | "follicular"
  | "ovulation"
  | "luteal_pms";

export type RecommendationLevel =
  | "rest"
  | "light"
  | "standard"
  | "strong"
  | "advanced";

export type RecommendedHours = 0 | 12 | 14 | 16 | 18 | 20;

export type SessionStatus = "running" | "paused" | "stopped" | "completed";

export type HealthWarnings = {
  pregnant: boolean;
  breastfeeding: boolean;
  diabetes: boolean;
  bloodSugarMedication: boolean;
  eatingDisorderHistory: boolean;
  under18: boolean;
  chronicDisease: boolean;
};

export type SymptomFlags = {
  dizziness: boolean;
  headache: boolean;
  weakness: boolean;
  intenseCraving: boolean;
  cramps: boolean;
};

export type UserProfile = {
  id: string;
  name: string;
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  waistCm: number;
  goal: FastingGoal;
  fastingExperience: FastingExperience;
  healthWarnings: HealthWarnings;
  menstrualCycleEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DailyCheckIn = {
  id: string;
  dateISO: string;
  sleepHours: number;
  sleepQuality: number;
  energy: number;
  stress: number;
  hunger: number;
  mood: number;
  lastMealTime: string;
  coffeeCups: number;
  coffeeWithSugarOrMilk: boolean;
  exerciseYesterday: ExerciseIntensity;
  currentWeightKg: number;
  currentWaistCm: number;
  menstrualPhase: MenstrualPhase;
  symptoms: SymptomFlags;
  createdAt: string;
};

export type RecommendationResult = {
  readinessScore: number;
  recommendedHours: RecommendedHours;
  level: RecommendationLevel;
  reasons: string[];
  warnings: string[];
  coachMessage: string;
  eatingWindowSuggestion: string;
};

export type FastingSession = {
  id: string;
  targetHours: RecommendedHours;
  startTime: string;
  status: SessionStatus;
  totalPausedMs: number;
  pausedAt?: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
};

export type HistoryEntry = {
  id: string;
  dateISO: string;
  profileId: string;
  checkIn: DailyCheckIn;
  recommendation: RecommendationResult;
  savedAt: string;
};
