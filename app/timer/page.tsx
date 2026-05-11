"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { Clock3 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FastingTimer } from "@/components/FastingTimer";
import { calculateFastingRecommendation } from "@/lib/fastingRecommendation";
import { getLatestCheckIn, getUserProfile } from "@/lib/storage";
import type { RecommendedHours } from "@/types/fasting";

export default function TimerPage() {
  const [targetHours, setTargetHours] = useState<RecommendedHours>(16);
  const [hasRecommendation, setHasRecommendation] = useState(false);

  useEffect(() => {
    const profile = getUserProfile();
    const checkIn = getLatestCheckIn();

    if (!profile || !checkIn) {
      return;
    }

    const recommendation = calculateFastingRecommendation(profile, checkIn);

    if (recommendation.recommendedHours > 0) {
      setTargetHours(recommendation.recommendedHours);
      setHasRecommendation(true);
    }
  }, []);

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#315f56]">Timer</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-[#24211d]">
            เริ่มจับเวลา
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#756b5d]">
            ตั้งเป้าตามคำแนะนำล่าสุด หรือเลือกเป้าหมายใหม่ถ้ายังไม่ได้เช็กอิน
          </p>
        </div>
        <Link
          href="/check-in"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#d8cfc1] bg-white px-4 text-sm font-semibold text-[#5e5041] shadow-sm"
        >
          <Clock3 size={17} aria-hidden="true" />
          เช็กอินใหม่
        </Link>
      </div>

      <FastingTimer initialTargetHours={targetHours} />

      {!hasRecommendation ? (
        <p className="mt-4 rounded-2xl bg-[#fff8f3] p-4 text-sm leading-6 text-[#7d351f]">
          ยังไม่มีคำแนะนำล่าสุดจากเช็กอิน วันนี้ระบบจึงตั้งค่าเริ่มต้นที่ 16 ชั่วโมง
        </p>
      ) : null}
    </section>
  );
}
