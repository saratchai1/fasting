"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { Save, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { makeId } from "@/lib/time";
import { getUserProfile, saveUserProfile } from "@/lib/storage";
import type {
  FastingExperience,
  FastingGoal,
  HealthWarnings,
  Sex,
  UserProfile,
} from "@/types/fasting";

const fieldClass =
  "mt-2 h-12 w-full rounded-2xl border border-[#ded4c4] bg-white px-4 text-base outline-none transition focus:border-[#315f56] focus:ring-4 focus:ring-[#315f56]/10";

const labelClass = "text-sm font-semibold text-[#50483f]";

const warningLabels: Array<{ key: keyof HealthWarnings; label: string }> = [
  { key: "pregnant", label: "ตั้งครรภ์" },
  { key: "breastfeeding", label: "ให้นมบุตร" },
  { key: "diabetes", label: "เบาหวาน" },
  { key: "bloodSugarMedication", label: "ใช้ยาควบคุมน้ำตาล" },
  { key: "eatingDisorderHistory", label: "เคยมีประวัติความผิดปกติด้านการกิน" },
  { key: "under18", label: "อายุต่ำกว่า 18 ปี" },
  { key: "chronicDisease", label: "มีโรคเรื้อรัง" },
];

const goalOptions: Array<{ value: FastingGoal; label: string }> = [
  { value: "fat_loss", label: "ลดไขมัน" },
  { value: "health", label: "สุขภาพโดยรวม" },
  { value: "metabolic_health", label: "Metabolic health" },
  { value: "discipline", label: "วินัย" },
  { value: "other", label: "อื่น ๆ" },
];

const experienceOptions: Array<{ value: FastingExperience; label: string }> = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const sexOptions: Array<{ value: Sex; label: string }> = [
  { value: "female", label: "หญิง" },
  { value: "male", label: "ชาย" },
  { value: "other", label: "อื่น ๆ" },
];

type FormState = Omit<UserProfile, "id" | "createdAt" | "updatedAt">;

const defaultWarnings: HealthWarnings = {
  pregnant: false,
  breastfeeding: false,
  diabetes: false,
  bloodSugarMedication: false,
  eatingDisorderHistory: false,
  under18: false,
  chronicDisease: false,
};

const defaultForm: FormState = {
  name: "",
  sex: "female",
  age: 30,
  heightCm: 165,
  weightKg: 65,
  waistCm: 78,
  goal: "health",
  fastingExperience: "beginner",
  healthWarnings: defaultWarnings,
  menstrualCycleEnabled: true,
};

export function OnboardingForm() {
  const router = useRouter();
  const [existingProfile, setExistingProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);

  useEffect(() => {
    const storedProfile = getUserProfile();

    if (storedProfile) {
      setExistingProfile(storedProfile);
      setForm({
        name: storedProfile.name,
        sex: storedProfile.sex,
        age: storedProfile.age,
        heightCm: storedProfile.heightCm,
        weightKg: storedProfile.weightKg,
        waistCm: storedProfile.waistCm,
        goal: storedProfile.goal,
        fastingExperience: storedProfile.fastingExperience,
        healthWarnings: storedProfile.healthWarnings,
        menstrualCycleEnabled: storedProfile.menstrualCycleEnabled,
      });
    }
  }, []);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setWarning(key: keyof HealthWarnings, value: boolean) {
    setForm((current) => ({
      ...current,
      healthWarnings: {
        ...current.healthWarnings,
        [key]: value,
      },
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const now = new Date().toISOString();
    const profile: UserProfile = {
      ...form,
      id: existingProfile?.id ?? makeId("profile"),
      createdAt: existingProfile?.createdAt ?? now,
      updatedAt: now,
    };

    saveUserProfile(profile);
    router.push("/check-in");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <section className="rounded-[28px] border border-[#e5dccc] bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            ชื่อ
            <input
              className={fieldClass}
              value={form.name}
              onChange={(event) => setField("name", event.target.value)}
              placeholder="เช่น เมย์"
              required
            />
          </label>

          <label className={labelClass}>
            อายุ
            <input
              className={fieldClass}
              type="number"
              min={1}
              value={form.age}
              onChange={(event) => setField("age", Number(event.target.value))}
              required
            />
          </label>

          <div>
            <p className={labelClass}>เพศ</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {sexOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setField("sex", option.value)}
                  className={`h-12 rounded-2xl border text-sm font-semibold transition ${
                    form.sex === option.value
                      ? "border-[#315f56] bg-[#315f56] text-white"
                      : "border-[#ded4c4] bg-white text-[#62594f]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <label className={labelClass}>
            เป้าหมาย
            <select
              className={fieldClass}
              value={form.goal}
              onChange={(event) => setField("goal", event.target.value as FastingGoal)}
            >
              {goalOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#e5dccc] bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <label className={labelClass}>
            ส่วนสูง (ซม.)
            <input
              className={fieldClass}
              type="number"
              min={80}
              value={form.heightCm}
              onChange={(event) => setField("heightCm", Number(event.target.value))}
            />
          </label>
          <label className={labelClass}>
            น้ำหนัก (กก.)
            <input
              className={fieldClass}
              type="number"
              min={20}
              step="0.1"
              value={form.weightKg}
              onChange={(event) => setField("weightKg", Number(event.target.value))}
            />
          </label>
          <label className={labelClass}>
            รอบเอว (ซม.)
            <input
              className={fieldClass}
              type="number"
              min={30}
              step="0.1"
              value={form.waistCm}
              onChange={(event) => setField("waistCm", Number(event.target.value))}
            />
          </label>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#e5dccc] bg-white p-5 shadow-sm">
        <p className={labelClass}>ประสบการณ์ Fast</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {experienceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setField("fastingExperience", option.value)}
              className={`h-12 rounded-2xl border text-sm font-semibold transition ${
                form.fastingExperience === option.value
                  ? "border-[#315f56] bg-[#315f56] text-white"
                  : "border-[#ded4c4] bg-white text-[#62594f]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-[#f7f4ee] p-4">
          <div>
            <p className="text-sm font-semibold text-[#50483f]">มีรอบเดือน</p>
            <p className="mt-1 text-xs leading-5 text-[#756b5d]">
              เปิดไว้เพื่อให้คำแนะนำยืดหยุ่นตาม phase
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setField("menstrualCycleEnabled", !form.menstrualCycleEnabled)
            }
            className={`h-9 w-16 rounded-full p-1 transition ${
              form.menstrualCycleEnabled ? "bg-[#315f56]" : "bg-[#d8cfc1]"
            }`}
            aria-pressed={form.menstrualCycleEnabled}
          >
            <span
              className={`block h-7 w-7 rounded-full bg-white transition ${
                form.menstrualCycleEnabled ? "translate-x-7" : ""
              }`}
            />
          </button>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#efc7b2] bg-[#fff8f3] p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#7d351f]">
          <ShieldCheck size={17} aria-hidden="true" />
          ข้อควรระวังด้านสุขภาพ
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {warningLabels.map((warning) => (
            <label
              key={warning.key}
              className="flex min-h-12 items-center gap-3 rounded-2xl border border-[#efd7c7] bg-white px-4 text-sm text-[#5e5041]"
            >
              <input
                type="checkbox"
                checked={form.healthWarnings[warning.key]}
                onChange={(event) => setWarning(warning.key, event.target.checked)}
                className="h-5 w-5 accent-[#315f56]"
              />
              <span>{warning.label}</span>
            </label>
          ))}
        </div>
      </section>

      <button
        type="submit"
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#315f56] px-5 text-base font-semibold text-white shadow-sm transition hover:bg-[#274c45]"
      >
        <Save size={19} aria-hidden="true" />
        บันทึกและไปเช็กอิน
      </button>
    </form>
  );
}
