"use client";

import {
  Activity,
  BarChart3,
  Clock3,
  Home,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "หน้าแรก", icon: Home },
  { href: "/dashboard", label: "แดชบอร์ด", icon: Activity },
  { href: "/check-in", label: "เช็กอิน", icon: Sparkles },
  { href: "/timer", label: "จับเวลา", icon: Clock3 },
  { href: "/history", label: "อินไซต์", icon: BarChart3 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f2f7ef] text-[#24211d]">
      <header className="sticky top-0 z-30 border-b border-[#d9eadf] bg-[#f8fbf5]/92 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Adaptive Fasting Coach">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2f6b54] text-white">
              <Sparkles size={18} aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold">Adaptive</span>
              <span className="block text-xs text-[#756b5d]">Fasting Coach</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="เมนูหลัก">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm transition ${
                    active
                      ? "bg-[#2f6b54] text-white"
                      : "text-[#526258] hover:bg-white"
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/disclaimer"
            className="flex h-10 items-center justify-center rounded-full border border-[#d9eadf] bg-white px-3 text-[#526258] shadow-sm transition hover:border-[#2f6b54]"
            title="ข้อควรระวัง"
            aria-label="ข้อควรระวัง"
          >
            <ShieldAlert size={18} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main className="pb-24 md:pb-0">{children}</main>

      <footer className="border-t border-[#d9eadf] bg-[#e9f8ef]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs leading-6 text-[#53645b] sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>
            แอปนี้ให้คำแนะนำด้านสุขภาพทั่วไปเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์
            หากเวียนหัว อ่อนแรง หน้ามืด หรือไม่สบาย ให้หยุด Fast ทันที
          </p>
          <Link href="/disclaimer" className="font-semibold text-[#2f6b54]">
            อ่านข้อจำกัดด้านความปลอดภัย
          </Link>
        </div>
      </footer>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#d9eadf] bg-[#f8fbf5]/95 px-2 py-2 shadow-[0_-16px_40px_rgba(47,107,84,0.12)] backdrop-blur md:hidden"
        aria-label="เมนูมือถือ"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] transition ${
                  active ? "bg-[#2f6b54] text-white" : "text-[#5d6b62]"
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
