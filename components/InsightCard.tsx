import type { ReactNode } from "react";

export function InsightCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-[#e5dccc] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#756b5d]">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-[#24211d]">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef7ef] text-[#315f56]">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#756b5d]">{detail}</p>
    </section>
  );
}
