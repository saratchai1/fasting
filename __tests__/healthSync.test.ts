import { describe, expect, it } from "vitest";
import { parseHealthSyncParams } from "@/lib/healthSync";

describe("parseHealthSyncParams", () => {
  it("prefills sleep hours and sleep quality from Apple Health shortcut params", () => {
    const result = parseHealthSyncParams(
      new URLSearchParams(
        "source=apple_health&sleepHours=9.72&sleepScore=94&weightKg=64.2",
      ),
      "2026-05-11T00:00:00.000Z",
    );

    expect(result?.source).toBe("apple_health");
    expect(result?.values.sleepHours).toBe(9.7);
    expect(result?.values.sleepQuality).toBe(5);
    expect(result?.values.currentWeightKg).toBe(64.2);
    expect(result?.sleepScore).toBe(94);
  });

  it("supports sleep minutes from iPhone Shortcuts", () => {
    const result = parseHealthSyncParams(
      new URLSearchParams("source=shortcut&sleepMinutes=410"),
      "2026-05-11T00:00:00.000Z",
    );

    expect(result?.source).toBe("shortcut");
    expect(result?.values.sleepHours).toBe(6.8);
  });

  it("returns null when no sync params are present", () => {
    expect(parseHealthSyncParams(new URLSearchParams(""))).toBeNull();
  });
});
