import type {
  DailyCheckIn,
  ExerciseIntensity,
  TrackerDataSource,
} from "@/types/fasting";

export type HealthSyncImport = {
  source: TrackerDataSource;
  importedAt: string;
  importedFields: string[];
  sleepScore?: number;
  values: Partial<
    Pick<
      DailyCheckIn,
      | "sleepHours"
      | "sleepQuality"
      | "currentWeightKg"
      | "currentWaistCm"
      | "lastMealTime"
      | "exerciseYesterday"
    >
  >;
};

const sourceLabels: Record<TrackerDataSource, string> = {
  manual: "กรอกเอง",
  apple_health: "Apple Health",
  huawei_health: "Huawei Health",
  shortcut: "iPhone Shortcut",
  other: "แอปสุขภาพ",
};

function parseNumber(value: string | null) {
  if (!value) {
    return null;
  }

  const normalized = Number(value.replace(",", "."));
  return Number.isFinite(normalized) ? normalized : null;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function normalizeSource(value: string | null): TrackerDataSource {
  if (value === "apple_health" || value === "apple") {
    return "apple_health";
  }

  if (value === "huawei_health" || value === "huawei") {
    return "huawei_health";
  }

  if (value === "shortcut" || value === "ios_shortcut") {
    return "shortcut";
  }

  return value ? "other" : "apple_health";
}

function sleepQualityFromScore(score: number) {
  if (score >= 85) {
    return 5;
  }

  if (score >= 70) {
    return 4;
  }

  if (score >= 55) {
    return 3;
  }

  if (score >= 40) {
    return 2;
  }

  return 1;
}

function parseSleepHours(params: URLSearchParams) {
  const sleepHours = parseNumber(params.get("sleepHours"));

  if (sleepHours !== null) {
    return sleepHours;
  }

  const sleepMinutes = parseNumber(params.get("sleepMinutes"));

  if (sleepMinutes !== null) {
    return sleepMinutes / 60;
  }

  return null;
}

function parseExercise(value: string | null): ExerciseIntensity | null {
  if (
    value === "none" ||
    value === "light" ||
    value === "moderate" ||
    value === "heavy"
  ) {
    return value;
  }

  return null;
}

export function getHealthSyncSourceLabel(source: TrackerDataSource) {
  return sourceLabels[source];
}

export function parseHealthSyncParams(
  params: URLSearchParams,
  importedAt = new Date().toISOString(),
): HealthSyncImport | null {
  const values: HealthSyncImport["values"] = {};
  const importedFields: string[] = [];
  const source = normalizeSource(params.get("source"));

  const sleepHours = parseSleepHours(params);
  const sleepScore = parseNumber(params.get("sleepScore"));
  const sleepQuality = parseNumber(params.get("sleepQuality"));
  const weight =
    parseNumber(params.get("weightKg")) ??
    parseNumber(params.get("currentWeightKg")) ??
    parseNumber(params.get("weight"));
  const waist =
    parseNumber(params.get("waistCm")) ??
    parseNumber(params.get("currentWaistCm")) ??
    parseNumber(params.get("waist"));
  const lastMealTime = params.get("lastMealTime");
  const exerciseYesterday = parseExercise(params.get("exerciseYesterday"));

  if (sleepHours !== null) {
    values.sleepHours = roundToOneDecimal(clamp(sleepHours, 0, 14));
    importedFields.push("ชั่วโมงการนอน");
  }

  if (sleepQuality !== null) {
    values.sleepQuality = Math.round(clamp(sleepQuality, 1, 5));
    importedFields.push("คุณภาพการนอน");
  } else if (sleepScore !== null) {
    values.sleepQuality = sleepQualityFromScore(clamp(sleepScore, 0, 100));
    importedFields.push("คุณภาพการนอน");
  }

  if (weight !== null) {
    values.currentWeightKg = Math.round(clamp(weight, 20, 300) * 10) / 10;
    importedFields.push("น้ำหนัก");
  }

  if (waist !== null) {
    values.currentWaistCm = Math.round(clamp(waist, 30, 250) * 10) / 10;
    importedFields.push("รอบเอว");
  }

  if (lastMealTime && /^\d{2}:\d{2}$/.test(lastMealTime)) {
    values.lastMealTime = lastMealTime;
    importedFields.push("เวลามื้อสุดท้าย");
  }

  if (exerciseYesterday) {
    values.exerciseYesterday = exerciseYesterday;
    importedFields.push("การออกกำลังกาย");
  }

  if (importedFields.length === 0 && !params.get("source")) {
    return null;
  }

  return {
    source,
    importedAt,
    importedFields,
    sleepScore: sleepScore === null ? undefined : clamp(sleepScore, 0, 100),
    values,
  };
}
