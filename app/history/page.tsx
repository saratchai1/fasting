"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { BarChart3, CalendarDays, Gauge, Ruler, Weight } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { InsightCard } from "@/components/InsightCard";
import { getHistoryEntries } from "@/lib/storage";
import { formatThaiDate } from "@/lib/time";
import type { HistoryEntry } from "@/types/fasting";

function formatDelta(value: number, unit: string) {
  if (!Number.isFinite(value) || value === 0) {
    return `0 ${unit}`;
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(1)} ${unit}`;
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(getHistoryEntries());
    setLoaded(true);
  }, []);

  const insights = useMemo(() => {
    const weeklyEntries = entries.slice(0, 7);
    const averageScore =
      weeklyEntries.length > 0
        ? Math.round(
            weeklyEntries.reduce(
              (sum, entry) => sum + entry.recommendation.readinessScore,
              0,
            ) / weeklyEntries.length,
          )
        : 0;
    const fastDays = weeklyEntries.filter(
      (entry) => entry.recommendation.recommendedHours > 0,
    ).length;
    const latest = weeklyEntries[0];
    const oldest = weeklyEntries[weeklyEntries.length - 1];
    const weightDelta =
      latest && oldest
        ? latest.checkIn.currentWeightKg - oldest.checkIn.currentWeightKg
        : 0;
    const waistDelta =
      latest && oldest
        ? latest.checkIn.currentWaistCm - oldest.checkIn.currentWaistCm
        : 0;

    return {
      averageScore,
      fastDays,
      weightDelta,
      waistDelta,
    };
  }, [entries]);

  if (loaded && entries.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="rounded-[32px] border border-[#e5dccc] bg-white p-6 text-center shadow-sm">
          <BarChart3
            className="mx-auto text-[#315f56]"
            size={36}
            aria-hidden="true"
          />
          <h1 className="mt-4 text-2xl font-semibold">ยังไม่มีประวัติ</h1>
          <p className="mt-2 text-sm leading-6 text-[#756b5d]">
            เช็กอินและกดบันทึกผลวันนี้บน dashboard เพื่อเริ่มเห็น insight
          </p>
          <Link
            href="/check-in"
            className="mt-5 inline-flex h-12 items-center justify-center rounded-2xl bg-[#315f56] px-5 text-sm font-semibold text-white"
          >
            ไปเช็กอิน
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-6">
        <p className="text-sm font-semibold text-[#315f56]">History / insights</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-[#24211d]">
          อินไซต์รายสัปดาห์
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#756b5d]">
          สรุปจากรายการที่คุณบันทึกล่าสุด สูงสุด 7 วัน
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <InsightCard
          label="คะแนนเฉลี่ย"
          value={`${insights.averageScore}/100`}
          detail="สะท้อน readiness จากการนอน พลังงาน ความเครียด และอาการ"
          icon={<Gauge size={20} aria-hidden="true" />}
        />
        <InsightCard
          label="วันที่ Fast ได้"
          value={`${insights.fastDays} วัน`}
          detail="นับวันที่ระบบแนะนำให้ Fast มากกว่า 0 ชั่วโมง"
          icon={<CalendarDays size={20} aria-hidden="true" />}
        />
        <InsightCard
          label="น้ำหนัก"
          value={formatDelta(insights.weightDelta, "กก.")}
          detail="เทียบรายการล่าสุดกับรายการเก่าสุดในช่วงที่แสดง"
          icon={<Weight size={20} aria-hidden="true" />}
        />
        <InsightCard
          label="รอบเอว"
          value={formatDelta(insights.waistDelta, "ซม.")}
          detail="ใช้ดูแนวโน้มแบบเบา ๆ ไม่ใช่การวินิจฉัยสุขภาพ"
          icon={<Ruler size={20} aria-hidden="true" />}
        />
      </div>

      <div className="mt-8 space-y-3">
        {entries.map((entry) => (
          <article
            key={entry.id}
            className="rounded-[24px] border border-[#e5dccc] bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#315f56]">
                  {formatThaiDate(entry.dateISO)}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-[#24211d]">
                  {entry.recommendation.recommendedHours === 0
                    ? "วันนี้พัก"
                    : `Fast ${entry.recommendation.recommendedHours} ชั่วโมง`}
                </h2>
              </div>
              <span className="inline-flex h-10 items-center rounded-full bg-[#eef7ef] px-3 text-sm font-semibold text-[#315f56]">
                {entry.recommendation.readinessScore}/100
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#756b5d]">
              {entry.recommendation.coachMessage}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
