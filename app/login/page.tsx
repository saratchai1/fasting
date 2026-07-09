"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LogIn, Mail, Lock, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === "Invalid login credentials") {
        setMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else if (error.message.includes("Failed to fetch") || error.message.includes("fetch failed")) {
        setMessage("เกิดข้อผิดพลาด: ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ฐานข้อมูลได้ (Failed to fetch) กรุณาตรวจสอบอินเทอร์เน็ต หรือโปรเจกต์ Supabase อาจจะถูกหยุดทำงานชั่วคราว (Paused)");
      } else {
        setMessage("เกิดข้อผิดพลาด: " + error.message);
      }
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="rounded-[32px] border border-[#d9eadf] bg-white p-8 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eef7ef] text-[#2f6b54]">
          <LogIn size={28} />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">เข้าสู่ระบบ</h1>
        <p className="mt-2 text-[#526258]">
          เข้าสู่ระบบเพื่อจัดการประวัติการ Fast ของคุณ
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#526258]">
              อีเมล
            </label>
            <div className="relative mt-1">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3b3a9]"
                size={18}
              />
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="h-12 w-full rounded-2xl border border-[#d9eadf] bg-[#f8fbf5] pl-10 pr-4 outline-none transition focus:border-[#2f6b54] focus:ring-1 focus:ring-[#2f6b54]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#526258]">
              รหัสผ่าน
            </label>
            <div className="relative mt-1">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3b3a9]"
                size={18}
              />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="h-12 w-full rounded-2xl border border-[#d9eadf] bg-[#f8fbf5] pl-10 pr-4 outline-none transition focus:border-[#2f6b54] focus:ring-1 focus:ring-[#2f6b54]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2f6b54] font-semibold text-white transition hover:bg-[#245341] disabled:opacity-50"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        {message && (
          <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-600">
            {message}
          </div>
        )}

        <div className="mt-8 border-t border-[#f0f4f1] pt-6 text-center">
          <p className="text-sm text-[#526258]">
            ยังไม่มีบัญชี?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#2f6b54] hover:underline"
            >
              สมัครสมาชิกใหม่
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
