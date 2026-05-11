"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { ClipboardList, Edit3, History, Play, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RecommendationCard } from "@/components/RecommendationCard";
import { ScoreCard } from "@/components/ScoreCard";
import { WarningCard } from "@/components/WarningCard";
import { calculateFastingRecommendation } from "@/lib/fastingRecommendation";
import {
  getLatestCheckIn,
  getUserProfile,
  saveFastingSession,
  saveHistoryEntry,
} from "@/lib/storage";
import { makeId } from "@/lib/time";
import type {
  DailyCheckIn,
  FastingSession,
  HistoryEntry,
  RecommendationResult,
  UserProfile,
} from "@/types/fasting";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checkIn, setCheckIn] = useState<DailyCheckIn | null>(null);
  const [recommendation, setRecommendation] =
    useState<RecommendationResult | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedProfile = getUserProfile();
    const latestCheckIn = getLatestCheckIn();

    setProfile(storedProfile);
    setCheckIn(latestCheckIn);
    setLoaded(true);

    if (storedProfile && latestCheckIn) {
      setRecommendation(calculateFastingRecommendation(storedProfile, latestCheckIn));
    }
  }, []);

  function saveTodayResult() {
    if (!profile || !checkIn || !recommendation) {
      return;
    }

    const entry: HistoryEntry = {
      id: makeId("history"),
      dateISO: checkIn.dateISO,
      profileId: profile.id,
      checkIn,
      recommendation,
      savedAt: new Date().toISOString(),
    };

    saveHistoryEntry(entry);
    setSaved(true);
  }

  function startFasting() {
    if (!recommendation || recommendation.recommendedHours === 0) {
      return;
    }

    const now = new Date().toISOString();
    const session: FastingSession = {
      id: makeId("session"),
      targetHours: recommendation.recommendedHours,
      startTime: now,
      status: "running",
      totalPausedMs: 0,
      createdAt: now,
      updatedAt: now,
    };

    saveFastingSession(session);
    router.push("/timer");
  }

  if (loaded && !profile) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="rounded-[32px] border border-[#e5dccc] bg-white p-6 text-center shadow-sm">
          <ClipboardList
            className="mx-auto text-[#315f56]"
            size={36}
            aria-hidden="true"
          />
          <h1 className="mt-4 text-2xl font-semibold">ยังไม่มีโปรไฟล์</h1>
          <p className="mt-2 text-sm leading-6 text-[#756b5d]">
            สร้าง profile ก่อนเพื่อให้ระบบคำนวณ fasting readiness ได้
          </p>
          <Link
            href="/onboarding"
            className="mt-5 inline-flex h-12 items-center justify-center rounded-2xl bg-[#315f56] px-5 text-sm font-semibold text-white"
          >
            เริ่ม Onboarding
          </Link>
        </div>
      </section>
    );
  }

  if (loaded && profile && !checkIn) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="rounded-[32px] border border-[#e5dccc] bg-white p-6 text-center shadow-sm">
          <ClipboardList
            className="mx-auto text-[#315f56]"
            size={36}
            aria-hidden="true"
          />
          <h1 className="mt-4 text-2xl font-semibold">เช็กอินวันนี้ก่อน</h1>
          <p className="mt-2 text-sm leading-6 text-[#756b5d]">
            ใช้ข้อมูลการนอน พลังงาน และอาการวันนี้เพื่อคำนวณคำแนะนำ
          </p>
          <Link
            href="/check-in"
            className="mt-5 inline-flex h-12 items-center justify-center rounded-2xl bg-[#315f56] px-5 text-sm font-semibold text-white"
          >
            ไปเช็กอินประจำวัน
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#315f56]">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-[#24211d]">
            สวัสดี{profile?.name ? `, ${profile.name}` : ""}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#756b5d]">
            วันนี้ระบบคำนวณจากข้อมูลเช็กอินล่าสุดและ profile ที่คุณตั้งไว้
          </p>
        </div>
        <Link
          href="/history"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#d8cfc1] bg-white px-4 text-sm font-semibold text-[#5e5041] shadow-sm"
        >
          <History size={17} aria-hidden="true" />
          ดูประวัติ
        </Link>
      </div>

      {recommendation ? (
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <ScoreCard score={recommendation.readinessScore} />
            <WarningCard warnings={recommendation.warnings} />

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={startFasting}
                disabled={recommendation.recommendedHours === 0}
                className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#315f56] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#274c45] disabled:cursor-not-allowed disabled:bg-[#b8b0a4]"
              >
                <Play size={18} aria-hidden="true" />
                เริ่มจับเวลา
              </button>
              <Link
                href="/check-in"
                className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-[#d8cfc1] bg-white px-5 text-sm font-semibold text-[#5e5041] shadow-sm transition hover:border-[#315f56]"
              >
                <Edit3 size={17} aria-hidden="true" />
                Edit check-in
              </Link>
              <button
                type="button"
                onClick={saveTodayResult}
                className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-[#d8cfc1] bg-white px-5 text-sm font-semibold text-[#5e5041] shadow-sm transition hover:border-[#315f56] sm:col-span-2"
              >
                <Save size={17} aria-hidden="true" />
                {saved ? "บันทึกแล้ว" : "บันทึกผลวันนี้"}
              </button>
            </div>
          </div>

          <RecommendationCard recommendation={recommendation} />
        </div>
      ) : null}
    </section>
  );
}
