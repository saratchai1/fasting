import { ShieldAlert } from "lucide-react";

export function WarningCard({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[28px] border border-[#efc7b2] bg-[#fff3ed] p-5 text-[#7d351f] shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <ShieldAlert size={17} aria-hidden="true" />
        สัญญาณที่ควรระวัง
      </div>
      <ul className="mt-3 space-y-2 text-sm leading-6">
        {warnings.map((warning) => (
          <li key={warning}>{warning}</li>
        ))}
      </ul>
    </section>
  );
}
