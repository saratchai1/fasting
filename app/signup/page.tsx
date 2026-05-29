"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { UserPlus, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function SignUpPage() {
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (password.length < 6) {
      setMessage("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message === "User already registered") {
        setMessage("อีเมลนี้ถูกใช้งานไปแล้ว");
      } else {
        setMessage("เกิดข้อผิดพลาด: " + error.message);
      }
    } else {
      // Supabase by default might require email confirmation
      setMessage("สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันตน หรือเข้าสู่ระบบได้ทันทีหากระบบอนุญาต");
      // Give a little time to see the message before redirecting
      setTimeout(() => router.push("/dashboard"), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="rounded-[32px] border border-[#d9eadf] bg-white p-8 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eef7ef] text-[#2f6b54]">
          <UserPlus size={28} />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">สมัครสมาชิก</h1>
        <p className="mt-2 text-[#526258]">
          สร้างบัญชีเพื่อเริ่มต้นบันทึกข้อมูลสุขภาพของคุณ
        </p>

        <form onSubmit={handleSignUp} className="mt-8 space-y-4">
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
                placeholder="อย่างน้อย 6 ตัวอักษร"
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
            {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </button>
        </form>

        {message && (
          <div className={`mt-6 rounded-2xl p-4 text-sm ${message.includes("สำเร็จ") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
            {message}
          </div>
        )}

        <div className="mt-8 border-t border-[#f0f4f1] pt-6 text-center">
          <p className="text-sm text-[#526258]">
            มีบัญชีอยู่แล้ว?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#2f6b54] hover:underline"
            >
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
