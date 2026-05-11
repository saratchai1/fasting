import { CalendarClock, CheckCircle2, Utensils } from "lucide-react";
import type { RecommendationResult } from "@/types/fasting";

const levelLabel: Record<RecommendationResult["level"], string> = {
  rest: "พัก",
  light: "เบา",
  standard: "มาตรฐาน",
  strong: "เข้มขึ้น",
  advanced: "Advanced",
};

export function RecommendationCard({
  recommendation,
}: {
  recommendation: RecommendationResult;
}) {
  const hoursText =
    recommendation.recommendedHours === 0
      ? "ไม่ Fast"
      : `${recommendation.recommendedHours} ชั่วโมง`;

  return (
    <section className="rounded-[28px] border border-[#dce5db] bg-[#eef7ef] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#315f56]">
            <CalendarClock size={16} aria-hidden="true" />
            แนะนำสำหรับวันนี้
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-[#172d29]">
            {hoursText}
          </h2>
          <p className="mt-2 text-sm text-[#48675f]">
            ระดับ {levelLabel[recommendation.level]}
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#315f56]">
          Today
        </span>
      </div>

      <p className="mt-5 rounded-2xl bg-white/70 p-4 text-sm leading-6 text-[#315f56]">
        {recommendation.coachMessage}
      </p>

      <div className="mt-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#315f56]">
          <CheckCircle2 size={16} aria-hidden="true" />
          เหตุผลที่แนะนำ
        </div>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-[#3f4f4b]">
          {recommendation.reasons.map((reason) => (
            <li key={reason} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#315f56]" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex gap-3 rounded-2xl bg-[#fffaf2] p-4 text-sm leading-6 text-[#635a50]">
        <Utensils className="mt-0.5 shrink-0 text-[#a56f2b]" size={18} aria-hidden="true" />
        <p>{recommendation.eatingWindowSuggestion}</p>
      </div>
    </section>
  );
}
