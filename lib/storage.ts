"use client";

import { supabase } from "./supabase";
import type {
  DailyCheckIn,
  FastingSession,
  HistoryEntry,
  UserProfile,
} from "@/types/fasting";

const STORAGE_KEYS = {
  profile: "adaptive-fasting-coach:user-profile",
  checkIns: "adaptive-fasting-coach:daily-check-ins",
  sessions: "adaptive-fasting-coach:fasting-sessions",
  history: "adaptive-fasting-coach:history-entries",
} as const;

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

// --- Profile ---

export function getUserProfile() {
  return readJson<UserProfile | null>(STORAGE_KEYS.profile, null);
}

export async function syncProfileToSupabase(profile: UserProfile) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const dbProfile = {
    id: session.user.id,
    name: profile.name,
    sex: profile.sex,
    age: profile.age,
    height_cm: profile.heightCm,
    weight_kg: profile.weightKg,
    waist_cm: profile.waistCm,
    goal: profile.goal,
    fasting_experience: profile.fastingExperience,
    menstrual_cycle_enabled: profile.menstrualCycleEnabled,
    health_warnings: profile.healthWarnings,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("profiles").upsert(dbProfile);
  if (error) {
    console.error("Error syncing profile to Supabase:", error.message);
  }
}

export function saveUserProfile(profile: UserProfile) {
  writeJson(STORAGE_KEYS.profile, profile);
  syncProfileToSupabase(profile);
}

// --- Check-ins ---

export function getDailyCheckIns() {
  return readJson<DailyCheckIn[]>(STORAGE_KEYS.checkIns, []);
}

export function getLatestCheckIn() {
  const checkIns = getDailyCheckIns();
  return checkIns[0] ?? null;
}

export async function syncCheckInToSupabase(checkIn: DailyCheckIn) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const profile = getUserProfile();

  const dbCheckIn = {
    user_id: session.user.id,
    date_iso: checkIn.dateISO,
    sleep_hours: checkIn.sleepHours,
    sleep_quality: checkIn.sleepQuality,
    energy: checkIn.energy,
    stress: checkIn.stress,
    hunger: checkIn.hunger,
    mood: checkIn.mood,
    last_meal_time: checkIn.lastMealTime,
    coffee_cups: checkIn.coffeeCups,
    coffee_with_sugar_or_milk: checkIn.coffeeWithSugarOrMilk,
    exercise_yesterday: checkIn.exerciseYesterday,
    current_weight_kg: checkIn.currentWeightKg || profile?.weightKg || 0,
    current_waist_cm: checkIn.currentWaistCm || profile?.waistCm || 0,
    menstrual_phase: checkIn.menstrualPhase,
    symptoms: checkIn.symptoms,
  };

  const { error } = await supabase.from("daily_check_ins").upsert(dbCheckIn);
  if (error) {
    console.error("Error syncing check-in to Supabase:", error.message);
  }
}

export function saveDailyCheckIn(checkIn: DailyCheckIn) {
  const existing = getDailyCheckIns().filter(
    (entry) => entry.dateISO !== checkIn.dateISO,
  );
  writeJson(STORAGE_KEYS.checkIns, [checkIn, ...existing]);
  syncCheckInToSupabase(checkIn);
}

// --- Sessions ---

export function getFastingSessions() {
  return readJson<FastingSession[]>(STORAGE_KEYS.sessions, []);
}

export function getActiveFastingSession() {
  return (
    getFastingSessions().find(
      (session) => session.status === "running" || session.status === "paused",
    ) ?? null
  );
}

export function saveFastingSession(session: FastingSession) {
  const existing = getFastingSessions().filter(
    (entry) => entry.id !== session.id,
  );
  writeJson(STORAGE_KEYS.sessions, [session, ...existing]);
}

// --- History ---

export function getHistoryEntries() {
  return readJson<HistoryEntry[]>(STORAGE_KEYS.history, []);
}

export function saveHistoryEntry(entry: HistoryEntry) {
  const existing = getHistoryEntries().filter(
    (historyEntry) => historyEntry.dateISO !== entry.dateISO,
  );
  writeJson(STORAGE_KEYS.history, [entry, ...existing]);
}

// --- Global ---

export function clearAdaptiveFastingData() {
  if (!canUseStorage()) {
    return;
  }

  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
}

// --- Pull Logic ---

export async function pullDataFromSupabase() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  // 1. Pull Profile
  const { data: dbProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") { // PGRST116 is 'no rows returned'
    console.error("Error pulling profile from Supabase:", profileError.message);
  }

  if (dbProfile) {
    const existing = getUserProfile();
    const profile: UserProfile = {
      id: dbProfile.id,
      name: dbProfile.name,
      sex: dbProfile.sex,
      age: dbProfile.age,
      heightCm: dbProfile.height_cm,
      weightKg: dbProfile.weight_kg ?? existing?.weightKg ?? 0,
      waistCm: dbProfile.waist_cm ?? existing?.waistCm ?? 0,
      goal: dbProfile.goal,
      fastingExperience: dbProfile.fasting_experience,
      healthWarnings: dbProfile.health_warnings || existing?.healthWarnings || {},
      menstrualCycleEnabled: dbProfile.menstrual_cycle_enabled,
      createdAt: dbProfile.updated_at,
      updatedAt: dbProfile.updated_at,
    };
    writeJson(STORAGE_KEYS.profile, profile);
  }

  // 2. Pull Check-ins
  const { data: dbCheckIns, error: checkInsError } = await supabase
    .from("daily_check_ins")
    .select("*")
    .eq("user_id", session.user.id)
    .order("date_iso", { ascending: false });

  if (checkInsError) {
    console.error("Error pulling check-ins from Supabase:", checkInsError.message);
  }

  if (dbCheckIns) {
    const checkIns: DailyCheckIn[] = dbCheckIns.map((db) => ({
      id: db.id,
      dateISO: db.date_iso,
      sleepHours: db.sleep_hours,
      sleepQuality: db.sleep_quality,
      energy: db.energy,
      stress: db.stress,
      hunger: db.hunger,
      mood: db.mood,
      lastMealTime: db.last_meal_time,
      coffeeCups: db.coffee_cups,
      coffeeWithSugarOrMilk: db.coffee_with_sugar_or_milk,
      exerciseYesterday: db.exercise_yesterday,
      currentWeightKg: db.current_weight_kg ?? 0,
      currentWaistCm: db.current_waist_cm ?? 0,
      menstrualPhase: db.menstrual_phase,
      symptoms: db.symptoms || {},
      createdAt: db.created_at,
    }));
    writeJson(STORAGE_KEYS.checkIns, checkIns);
  }
}
