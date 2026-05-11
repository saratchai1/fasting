"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { ClipboardCheck, Moon, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  getDailyCheckIns,
  getUserProfile,
  saveDailyCheckIn,
} from "@/lib/storage";
import { makeId, todayISO } from "@/lib/time";
import type {
  DailyCheckIn,
  ExerciseIntensity,
  MenstrualPhase,
  SymptomFlags,
  UserProfile,
} from "@/types/fasting";

const fieldClass =
  "mt-2 h-12 w-full rounded-2xl border border-[#ded4c4] bg-white px-4 text-base outline-none transition focus:border-[#315f56] focus:ring-4 focus:ring-[#315f56]/10";

const labelClass = "text-sm font-semibold text-[#50483f]";

const exerciseOptions: Array<{ value: ExerciseIntensity; label: string }> = [
  { value: "none", label: "ไม่มี" },
  { value: "light", label: "เบา" },
  { value: "moderate", label: "กลาง" },
  { value: "heavy", label: "หนัก" },
];

const menstrualOptions: Array<{ value: MenstrualPhase; label: string }> = [
  { value: "none", label: "ไม่มี" },
  { value: "period_day_1_2", label: "ประจำเดือนวัน 1-2" },
  { value: "period_day_3_plus", label: "ประจำเดือนวัน 3+" },
  { value: "follicular", label: "Follicular" },
  { value: "ovulation", label: "Ovulation" },
  { value: "luteal_pms", label: "Luteal / PMS" },
];

const symptomOptions: Array<{ key: keyof SymptomFlags; label: string }> = [
  { key: "dizziness", label: "เวียนหัว" },
  { key: "headache", label: "ปวดหัว" },
  { key: "weakness", label: "อ่อนแรง" },
  { key: "intenseCraving", label: "อยากอาหารรุนแรง" },
  { key: "cramps", label: "ปวดท้อง/ตะคริว" },
];

type CheckInFormState = Omit<DailyCheckIn, "id" | "dateISO" | "createdAt">;

const defaultSymptoms: SymptomFlags = {
  dizziness: false,
  headache: false,
  weakness: false,
  intenseCraving: false,
  cramps: false,
};

const defaultForm: CheckInFormState = {
  sleepHours: 7,
  sleepQuality: 4,
  energy: 4,
  stress: 2,
  hunger: 2,
  mood: 4,
  lastMealTime: "20:00",
  coffeeCups: 1,
  coffeeWithSugarOrMilk: false,
  exerciseYesterday: "light",
  currentWeightKg: 65,
  currentWaistCm: 78,
  menstrualPhase: "none",
  symptoms: defaultSymptoms,
};

function RangeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-2xl border border-[#e5dccc] bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <span className={labelClass}>{label}</span>
        <span className="grid h-8 min-w-8 place-items-center rounded-full bg-[#eef7ef] px-2 text-sm font-semibold text-[#315f56]">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 w-full accent-[#315f56]"
      />
    </label>
  );
}

export function CheckInForm() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState<CheckInFormState>(defaultForm);

  useEffect(() => {
    const storedProfile = getUserProfile();
    const dateISO = todayISO();
    const todayCheckIn = getDailyCheckIns().find((entry) => entry.dateISO === dateISO);

    setProfile(storedProfile);
    setLoaded(true);

    if (todayCheckIn) {
      setForm({
        sleepHours: todayCheckIn.sleepHours,
        sleepQuality: todayCheckIn.sleepQuality,
        energy: todayCheckIn.energy,
        stress: todayCheckIn.stress,
        hunger: todayCheckIn.hunger,
        mood: todayCheckIn.mood,
        lastMealTime: todayCheckIn.lastMealTime,
        coffeeCups: todayCheckIn.coffeeCups,
        coffeeWithSugarOrMilk: todayCheckIn.coffeeWithSugarOrMilk,
        exerciseYesterday: todayCheckIn.exerciseYesterday,
        currentWeightKg: todayCheckIn.currentWeightKg,
        currentWaistCm: todayCheckIn.currentWaistCm,
        menstrualPhase: todayCheckIn.menstrualPhase,
        symptoms: todayCheckIn.symptoms,
      });
      return;
    }

    if (storedProfile) {
      setForm((current) => ({
        ...current,
        currentWeightKg: storedProfile.weightKg,
        currentWaistCm: storedProfile.waistCm,
        menstrualPhase: storedProfile.menstrualCycleEnabled ? "follicular" : "none",
      }));
    }
  }, []);

  function setField<K extends keyof CheckInFormState>(
    key: K,
    value: CheckInFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setSymptom(key: keyof SymptomFlags, value: boolean) {
    setForm((current) => ({
      ...current,
      symptoms: {
        ...current.symptoms,
        [key]: value,
      },
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!profile) {
      router.push("/onboarding");
      return;
    }

    const now = new Date().toISOString();
    const checkIn: DailyCheckIn = {
      ...form,
      id: makeId("checkin"),
      dateISO: todayISO(),
      menstrualPhase: profile.menstrualCycleEnabled ? form.menstrualPhase : "none",
      createdAt: now,
    };

    saveDailyCheckIn(checkIn);
    router.push("/dashboard");
  }

  if (loaded && !profile) {
    return (
      <section className="rounded-[28px] border border-[#e5dccc] bg-white p-6 text-center shadow-sm">
        <ClipboardCheck className="mx-auto text-[#315f56]" size={34} aria-hidden="true" />
        <h2 className="mt-4 text-xl font-semibold text-[#24211d]">
          เริ่มจากข้อมูลพื้นฐานก่อน
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#756b5d]">
          ระบบต้องใช้ profile เพื่อประเมินเพดานการ Fast ที่เหมาะกับคุณ
        </p>
        <Link
          href="/onboarding"
          className="mt-5 inline-flex h-12 items-center justify-center rounded-2xl bg-[#315f56] px-5 text-sm font-semibold text-white"
        >
          ไป Onboarding
        </Link>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <section className="rounded-[28px] border border-[#e5dccc] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#315f56]">
          <Moon size={17} aria-hidden="true" />
          การนอนและความรู้สึกวันนี้
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            นอนกี่ชั่วโมง
            <input
              className={fieldClass}
              type="number"
              min={0}
              max={14}
              step="0.5"
              value={form.sleepHours}
              onChange={(event) => setField("sleepHours", Number(event.target.value))}
            />
          </label>

          <label className={labelClass}>
            มื้อสุดท้ายเวลา
            <input
              className={fieldClass}
              type="time"
              value={form.lastMealTime}
              onChange={(event) => setField("lastMealTime", event.target.value)}
            />
          </label>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <RangeField
            label="คุณภาพการนอน"
            value={form.sleepQuality}
            onChange={(value) => setField("sleepQuality", value)}
          />
          <RangeField
            label="พลังงาน"
            value={form.energy}
            onChange={(value) => setField("energy", value)}
          />
          <RangeField
            label="ความเครียด"
            value={form.stress}
            onChange={(value) => setField("stress", value)}
          />
          <RangeField
            label="ความหิว"
            value={form.hunger}
            onChange={(value) => setField("hunger", value)}
          />
          <RangeField
            label="อารมณ์"
            value={form.mood}
            onChange={(value) => setField("mood", value)}
          />
        </div>
      </section>

      <section className="rounded-[28px] border border-[#e5dccc] bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            กาแฟวันนี้ (แก้ว)
            <input
              className={fieldClass}
              type="number"
              min={0}
              value={form.coffeeCups}
              onChange={(event) => setField("coffeeCups", Number(event.target.value))}
            />
          </label>
          <label className={labelClass}>
            น้ำหนักปัจจุบัน (กก.)
            <input
              className={fieldClass}
              type="number"
              min={20}
              step="0.1"
              value={form.currentWeightKg}
              onChange={(event) =>
                setField("currentWeightKg", Number(event.target.value))
              }
            />
          </label>
          <label className={labelClass}>
            รอบเอวปัจจุบัน (ซม.)
            <input
              className={fieldClass}
              type="number"
              min={30}
              step="0.1"
              value={form.currentWaistCm}
              onChange={(event) =>
                setField("currentWaistCm", Number(event.target.value))
              }
            />
          </label>
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-[#ded4c4] bg-[#f7f4ee] px-4 text-sm font-semibold text-[#50483f] md:mt-7">
            <input
              type="checkbox"
              checked={form.coffeeWithSugarOrMilk}
              onChange={(event) =>
                setField("coffeeWithSugarOrMilk", event.target.checked)
              }
              className="h-5 w-5 accent-[#315f56]"
            />
            กาแฟใส่น้ำตาลหรือนม
          </label>
        </div>

        <div className="mt-5">
          <p className={labelClass}>ออกกำลังกายเมื่อวาน</p>
          <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
            {exerciseOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setField("exerciseYesterday", option.value)}
                className={`h-12 rounded-2xl border text-sm font-semibold transition ${
                  form.exerciseYesterday === option.value
                    ? "border-[#315f56] bg-[#315f56] text-white"
                    : "border-[#ded4c4] bg-white text-[#62594f]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {profile?.menstrualCycleEnabled ? (
        <section className="rounded-[28px] border border-[#e5dccc] bg-white p-5 shadow-sm">
          <p className={labelClass}>Menstrual phase</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {menstrualOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setField("menstrualPhase", option.value)}
                className={`min-h-12 rounded-2xl border px-3 text-sm font-semibold transition ${
                  form.menstrualPhase === option.value
                    ? "border-[#315f56] bg-[#315f56] text-white"
                    : "border-[#ded4c4] bg-white text-[#62594f]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-[28px] border border-[#efc7b2] bg-[#fff8f3] p-5 shadow-sm">
        <p className="text-sm font-semibold text-[#7d351f]">อาการวันนี้</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {symptomOptions.map((symptom) => (
            <label
              key={symptom.key}
              className="flex min-h-12 items-center gap-3 rounded-2xl border border-[#efd7c7] bg-white px-4 text-sm text-[#5e5041]"
            >
              <input
                type="checkbox"
                checked={form.symptoms[symptom.key]}
                onChange={(event) => setSymptom(symptom.key, event.target.checked)}
                className="h-5 w-5 accent-[#315f56]"
              />
              <span>{symptom.label}</span>
            </label>
          ))}
        </div>
      </section>

      <button
        type="submit"
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#315f56] px-5 text-base font-semibold text-white shadow-sm transition hover:bg-[#274c45]"
      >
        <Save size={19} aria-hidden="true" />
        บันทึกผลวันนี้
      </button>
    </form>
  );
}
