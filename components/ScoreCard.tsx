import { Gauge } from "lucide-react";

export function ScoreCard({ score }: { score: number }) {
  const safeScore = Math.max(0, Math.min(100, score));

  return (
    <section className="rounded-[28px] border border-[#e5dccc] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#756b5d]">
            <Gauge size={16} aria-hidden="true" />
            คะแนนความพร้อมของร่างกาย
          </div>
          <p className="mt-2 text-4xl font-semibold tracking-normal text-[#24211d]">
            {safeScore}
          </p>
          <p className="mt-1 text-sm text-[#756b5d]">จาก 100 คะแนน</p>
        </div>
        <div
          className="grid h-24 w-24 place-items-center rounded-full"
          style={{
            background: `conic-gradient(#315f56 ${safeScore * 3.6}deg, #efe5d6 0deg)`,
          }}
          aria-hidden="true"
        >
          <div className="h-16 w-16 rounded-full bg-white" />
        </div>
      </div>
    </section>
  );
}
