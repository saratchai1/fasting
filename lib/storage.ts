"use client";

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

export function getUserProfile() {
  return readJson<UserProfile | null>(STORAGE_KEYS.profile, null);
}

export function saveUserProfile(profile: UserProfile) {
  writeJson(STORAGE_KEYS.profile, profile);
}

export function getDailyCheckIns() {
  return readJson<DailyCheckIn[]>(STORAGE_KEYS.checkIns, []);
}

export function getLatestCheckIn() {
  const checkIns = getDailyCheckIns();
  return checkIns[0] ?? null;
}

export function saveDailyCheckIn(checkIn: DailyCheckIn) {
  const existing = getDailyCheckIns().filter(
    (entry) => entry.dateISO !== checkIn.dateISO,
  );
  writeJson(STORAGE_KEYS.checkIns, [checkIn, ...existing]);
}

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

export function getHistoryEntries() {
  return readJson<HistoryEntry[]>(STORAGE_KEYS.history, []);
}

export function saveHistoryEntry(entry: HistoryEntry) {
  const existing = getHistoryEntries().filter(
    (historyEntry) => historyEntry.dateISO !== entry.dateISO,
  );
  writeJson(STORAGE_KEYS.history, [entry, ...existing]);
}

export function clearAdaptiveFastingData() {
  if (!canUseStorage()) {
    return;
  }

  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
}
