import { describe, expect, it } from "vitest";
import { calculateFastingRecommendation } from "@/lib/fastingRecommendation";
import type { DailyCheckIn, UserProfile } from "@/types/fasting";

function profile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: "profile_test",
    name: "Mai",
    sex: "female",
    age: 34,
    heightCm: 165,
    weightKg: 64,
    waistCm: 78,
    goal: "health",
    fastingExperience: "beginner",
    menstrualCycleEnabled: true,
    healthWarnings: {
      pregnant: false,
      breastfeeding: false,
      diabetes: false,
      bloodSugarMedication: false,
      eatingDisorderHistory: false,
      under18: false,
      chronicDisease: false,
    },
    createdAt: "2026-05-11T00:00:00.000Z",
    updatedAt: "2026-05-11T00:00:00.000Z",
    ...overrides,
  };
}

function checkIn(overrides: Partial<DailyCheckIn> = {}): DailyCheckIn {
  return {
    id: "checkin_test",
    dateISO: "2026-05-11",
    sleepHours: 8,
    sleepQuality: 5,
    energy: 5,
    stress: 1,
    hunger: 1,
    mood: 4,
    lastMealTime: "20:00",
    coffeeCups: 1,
    coffeeWithSugarOrMilk: false,
    exerciseYesterday: "light",
    currentWeightKg: 64,
    currentWaistCm: 78,
    menstrualPhase: "follicular",
    symptoms: {
      dizziness: false,
      headache: false,
      weakness: false,
      intenseCraving: false,
      cramps: false,
    },
    createdAt: "2026-05-11T00:00:00.000Z",
    ...overrides,
  };
}

describe("calculateFastingRecommendation", () => {
  it("keeps a beginner with good sleep at 16 hours or less", () => {
    const result = calculateFastingRecommendation(profile(), checkIn());

    expect(result.readinessScore).toBeGreaterThanOrEqual(85);
    expect(result.recommendedHours).toBe(16);
  });

  it("allows an advanced user with excellent readiness to receive 20 hours", () => {
    const result = calculateFastingRecommendation(
      profile({ fastingExperience: "advanced" }),
      checkIn(),
    );

    expect(result.recommendedHours).toBe(20);
    expect(result.level).toBe("advanced");
  });

  it("caps fasting at 12 hours when sleep is under 5 hours", () => {
    const result = calculateFastingRecommendation(
      profile({ fastingExperience: "advanced" }),
      checkIn({ sleepHours: 4.5 }),
    );

    expect(result.recommendedHours).toBeLessThanOrEqual(12);
    expect(result.reasons.join(" ")).toContain("นอนน้อยกว่า 5 ชั่วโมง");
  });

  it("recommends no fasting when dizziness is present", () => {
    const result = calculateFastingRecommendation(
      profile({ fastingExperience: "advanced" }),
      checkIn({
        symptoms: {
          dizziness: true,
          headache: false,
          weakness: false,
          intenseCraving: false,
          cramps: false,
        },
      }),
    );

    expect(result.recommendedHours).toBe(0);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("caps period day 1-2 with cramps at rest or 12 hours", () => {
    const result = calculateFastingRecommendation(
      profile({ fastingExperience: "advanced" }),
      checkIn({
        menstrualPhase: "period_day_1_2",
        symptoms: {
          dizziness: false,
          headache: false,
          weakness: false,
          intenseCraving: false,
          cramps: true,
        },
      }),
    );

    expect([0, 12]).toContain(result.recommendedHours);
  });

  it("recommends no fasting and shows a warning for a hard-stop high-risk profile", () => {
    const result = calculateFastingRecommendation(
      profile({
        healthWarnings: {
          pregnant: true,
          breastfeeding: false,
          diabetes: false,
          bloodSugarMedication: false,
          eatingDisorderHistory: false,
          under18: false,
          chronicDisease: false,
        },
      }),
      checkIn(),
    );

    expect(result.recommendedHours).toBe(0);
    expect(result.warnings.join(" ")).toContain("ไม่ใช่คำแนะนำทางการแพทย์");
  });

  it("caps PMS fasting intensity", () => {
    const result = calculateFastingRecommendation(
      profile({ fastingExperience: "advanced" }),
      checkIn({ menstrualPhase: "luteal_pms", sleepHours: 6 }),
    );

    expect(result.recommendedHours).toBeLessThanOrEqual(14);
    expect(result.reasons.join(" ")).toContain("Luteal/PMS");
  });
});
