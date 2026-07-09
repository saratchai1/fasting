"use client";

import {
  ArrowRight,
  ChevronDown,
  Flame,
  HeartPulse,
  Leaf,
  MoveRight,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  TreePine,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Intersection Observer hook for scroll-reveal                      */
/* ------------------------------------------------------------------ */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ------------------------------------------------------------------ */
/*  Reusable reveal wrapper                                           */
/* ------------------------------------------------------------------ */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useReveal(0.12);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Counter animation                                                 */
/* ------------------------------------------------------------------ */
function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const { ref, visible } = useReveal(0.3);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ================================================================== */
/*  LANDING PAGE                                                      */
/* ================================================================== */
export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ========================================================== */}
      {/*  HERO                                                       */}
      {/* ========================================================== */}
      <section className="relative min-h-[100svh] overflow-hidden bg-[#070f0d]">
        {/* Parallax background */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ transform: `translateY(${scrollY * 0.25}px)` }}
        >
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2400&q=80')",
              filter: "brightness(0.3) saturate(0.7)",
            }}
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070f0d]/60 via-[#070f0d]/30 to-[#070f0d]" />

        {/* Animated glow orbs */}
        <div
          aria-hidden="true"
          className="absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(47,107,84,0.4) 0%, transparent 70%)",
            animation: "pulse 6s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(217,249,157,0.3) 0%, transparent 70%)",
            animation: "pulse 8s ease-in-out infinite 2s",
          }}
        />

        {/* Hero content */}
        <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm text-white/70 backdrop-blur-md">
              <Leaf size={16} className="text-[#a3e635]" />
              MANIFESTO
            </div>

            <h1
              className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-7xl"
              style={{ textShadow: "0 4px 60px rgba(0,0,0,0.5)" }}
            >
              เราไม่ได้เกิดมา
              <br />
              <span className="bg-gradient-to-r from-[#a3e635] via-[#4ade80] to-[#2dd4bf] bg-clip-text text-transparent">
                เพื่อแค่ไม่ป่วย
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
              ในศตวรรษที่ 21 มนุษย์มีอาหาร เทคโนโลยี ข้อมูลสุขภาพ
              และผู้เชี่ยวชาญมากที่สุดในประวัติศาสตร์
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-[#fbbf24] sm:text-xl">
              แต่เรากลับอ้วนขึ้น อ่อนแอลง เครียดมากขึ้น นอนน้อยลง
              <br />
              และเจ็บป่วยด้วยโรคเรื้อรังมากกว่าที่เคย
            </p>

            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/onboarding"
                className="group flex h-14 items-center gap-3 rounded-2xl bg-gradient-to-r from-[#2f6b54] to-[#3b8268] px-8 text-base font-semibold text-white shadow-[0_8px_32px_rgba(47,107,84,0.4)] transition-all hover:shadow-[0_12px_48px_rgba(47,107,84,0.5)] hover:translate-y-[-2px]"
              >
                เริ่มต้นเปลี่ยนแปลง
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <a
                href="#manifesto"
                className="flex h-14 items-center gap-2 rounded-2xl border border-white/20 px-8 text-base font-medium text-white/80 transition hover:bg-white/10"
              >
                อ่าน Manifesto
                <ChevronDown size={18} />
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <div
              className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 p-1"
              aria-hidden="true"
            >
              <div
                className="h-2 w-1.5 rounded-full bg-white/60"
                style={{ animation: "scrollDot 2s ease-in-out infinite" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/*  THE PARADOX — Problem Statement                            */}
      {/* ========================================================== */}
      <section
        id="manifesto"
        className="relative overflow-hidden bg-[#070f0d] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#a3e635]">
                ความย้อนแย้ง
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">
                ถ้าความรู้แก้ปัญหาได้จริง
                <br />
                <span className="text-white/50">
                  แล้วทำไมสุขภาพเราจึงแย่ลง?
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {[
              {
                emoji: "🧠",
                title: "เรามีข้อมูลมากที่สุด",
                desc: "แต่แยกไม่ออกว่าหิวจริง หรือแค่อยากกิน",
              },
              {
                emoji: "💊",
                title: "เรามีตัวช่วยมากที่สุด",
                desc: "แต่สุขภาพไม่ใช่ผลลัพธ์ของการซื้อผลิตภัณฑ์",
              },
              {
                emoji: "🏋️",
                title: "เรามีโปรแกรมมากที่สุด",
                desc: "แต่สุขภาพไม่ใช่การแข่งขันว่าใครมีวินัยกว่ากัน",
              },
              {
                emoji: "📱",
                title: "เรามีแอปมากที่สุด",
                desc: "แต่แยกไม่ออกว่าเมื่อไหร่ควรนอน เมื่อไหร่ควรเสพ",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/8">
                  <span className="text-3xl">{item.emoji}</span>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-white/50">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/*  THE ROOT CAUSE — รู้เขา รู้เรา                             */}
      {/* ========================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#070f0d] via-[#0d1a16] to-[#0f221c] py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <Quote
                size={40}
                className="mx-auto mb-6 text-[#a3e635]/40"
              />
              <blockquote className="text-2xl font-medium leading-relaxed text-white sm:text-3xl">
                &ldquo;รู้เขา รู้เรา
                <br />
                รบ 100 ครั้ง ชนะ 100 ครั้ง&rdquo;
              </blockquote>
              <p className="mt-2 text-sm text-white/40">— สุภาษิตจีน</p>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-[#a3e635]/20 bg-[#a3e635]/5 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a3e635]/15">
                  <Zap size={24} className="text-[#a3e635]" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-[#a3e635]">
                  รู้เขา — ความรู้ภายนอก
                </h3>
                <p className="mt-3 leading-relaxed text-white/60">
                  คนยุคนี้ได้เปรียบและเก่งกว่าคนยุคก่อนหลายเท่าตัว
                  เรามีความรู้เรื่องสุขภาพ โภชนาการ การออกกำลังกายมากมาย
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#a3e635]/10 px-4 py-2 text-sm font-medium text-[#a3e635]">
                  ✓ ทำได้ดีมาก
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="rounded-3xl border border-[#f87171]/20 bg-[#f87171]/5 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f87171]/15">
                  <HeartPulse size={24} className="text-[#f87171]" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-[#f87171]">
                  รู้เรา — ธรรมชาติของตัวเอง
                </h3>
                <p className="mt-3 leading-relaxed text-white/60">
                  รู้จักร่างกาย อารมณ์ ความคิด ความเครียด
                  การตอบสนองต่างๆของตัวเองอย่างเท่าทัน
                  คนยุคนี้ทำได้ค่อนข้างแย่มากๆเมื่อเทียบกับคนยุคก่อน
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#f87171]/10 px-4 py-2 text-sm font-medium text-[#f87171]">
                  ✗ ทำได้แย่มาก
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.3}>
            <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
              <p className="text-xl leading-relaxed text-white/80 sm:text-2xl">
                ปัญหาที่เป็นต้นตอจริงๆ{" "}
                <span className="font-bold text-white">
                  ไม่ใช่การขาดข้อมูล
                </span>
                <br />
                <span className="text-white/50">
                  แต่คือเราสูญเสียความเข้าใจในธรรมชาติของมนุษย์
                  ซึ่งก็คือตัวเราเอง
                </span>
              </p>
              <p className="mt-2 text-sm text-white/30">
                — จากประสบการณ์ดูแลลูกค้ากว่า 16 ปี
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================== */}
      {/*  WHAT HEALTH REALLY IS                                      */}
      {/* ========================================================== */}
      <section className="relative overflow-hidden bg-[#0f221c] py-24 sm:py-32">
        {/* Decorative gradient */}
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 h-[600px] w-[600px] opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(163,230,53,0.2) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#a3e635]">
                ความจริง
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                สุขภาพคืออะไรกันแน่?
              </h2>
            </div>
          </Reveal>

          {/* What health is NOT */}
          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "สุขภาพไม่ใช่อาหารเสริม",
                "สุขภาพไม่ใช่สูตรลดน้ำหนักเทพๆ",
                "สุขภาพไม่ใช่การนับแคลอรี่ทุกมื้อ",
                "สุขภาพไม่ใช่การออกกำลังกายให้หนักขึ้น",
                "สุขภาพไม่ใช่การหาวิธีใหม่ๆตลอด",
                "สุขภาพไม่ใช่ผลลัพธ์ของการซื้อผลิตภัณฑ์",
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-5 py-4"
                >
                  <span className="text-[#f87171]">✗</span>
                  <span className="text-sm text-white/60">{text}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* What health IS */}
          <Reveal delay={0.2}>
            <div className="mt-12 rounded-[32px] border border-[#a3e635]/20 bg-gradient-to-br from-[#a3e635]/10 via-[#2f6b54]/10 to-transparent p-8 sm:p-12">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#a3e635]/20">
                  <Sparkles size={28} className="text-[#a3e635]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white sm:text-2xl">
                    สุขภาพเป็นผลลัพธ์ของการใช้ชีวิตที่...
                  </h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        icon: HeartPulse,
                        label: "เข้าใจตัวเอง",
                        color: "#f472b6",
                      },
                      {
                        icon: ShieldCheck,
                        label: "เคารพตัวเอง",
                        color: "#60a5fa",
                      },
                      {
                        icon: Target,
                        label: "รับผิดชอบต่อตัวเอง",
                        color: "#a3e635",
                      },
                      {
                        icon: Users,
                        label: "เห็นอกเห็นใจตัวเอง",
                        color: "#fbbf24",
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          <Icon size={22} style={{ color: item.color }} />
                          <span className="font-medium text-white/80">
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-6 text-sm leading-relaxed text-white/40">
                    ซึ่งจะทำให้คุณเห็นอกเห็นใจคนอื่นได้เองโดยอัตโนมัติ
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================== */}
      {/*  HUMAN EVOLUTION — Designed to Adapt                        */}
      {/* ========================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f221c] to-[#111f1a] py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#a3e635]">
                วิวัฒนาการ
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                มนุษย์ถูกออกแบบมา
                <span className="text-[#a3e635]">เพื่อการปรับตัว</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/50">
                ตลอดหลายแสนปีที่ผ่านมา บรรพบุรุษของเราไม่ได้มีฟิตเนส อาหารเสริม
                หรือแอปสุขภาพ แต่พวกเขามีสิ่งหนึ่ง —
                ความสามารถในการปรับตัว
              </p>
            </div>
          </Reveal>

          {/* Activities our ancestors did */}
          <Reveal delay={0.15}>
            <div className="mt-14 flex flex-wrap justify-center gap-3">
              {[
                "เดิน",
                "วิ่ง",
                "ปีน",
                "ยก",
                "แบก",
                "ล่า",
                "เล่น",
                "สำรวจ",
                "พักผ่อน",
                "อดอาหารเป็นครั้งคราว",
              ].map((act, i) => (
                <span
                  key={act}
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:border-[#a3e635]/40 hover:bg-[#a3e635]/10 hover:text-[#a3e635]"
                  style={{
                    animationDelay: `${i * 0.05}s`,
                  }}
                >
                  {act}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-12 rounded-3xl border border-[#fbbf24]/20 bg-[#fbbf24]/5 p-8 text-center">
              <p className="text-lg leading-relaxed text-white/70 sm:text-xl">
                ร่างกายมนุษย์วิวัฒนาการภายใต้
                <span className="font-bold text-[#fbbf24]">แรงกดดัน</span>
                <br />
                ไม่ใช่ภายใต้
                <span className="font-bold text-white/90">
                  ความสะดวกสบาย
                </span>
                แบบที่เราใช้ชีวิตอยู่ทุกวันนี้
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================== */}
      {/*  AUTOPHAGY — Beyond Fasting                                 */}
      {/* ========================================================== */}
      <section className="relative overflow-hidden bg-[#111f1a] py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#a3e635]/20 to-[#2dd4bf]/20">
                <Flame size={30} className="text-[#a3e635]" />
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Autophagy ไม่ใช่แค่การอดอาหาร
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/50">
                Autophagy เป็นเพียงหนึ่งในภาษาที่ร่างกายใช้
                ในการซ่อมแซมและพัฒนาตัวเอง
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "การเคลื่อนไหว",
                desc: "ไม่ใช่อยู่นิ่งๆ แล้วทนอดอาหาร 72 ชั่วโมง",
                icon: "🏃",
              },
              {
                title: "ฝึกความแข็งแรง",
                desc: "สร้างศักยภาพของร่างกายผ่านการฝึก",
                icon: "💪",
              },
              {
                title: "นอนหลับที่ดี",
                desc: "การฟื้นตัวที่เหมาะสมเป็นรากฐานสำคัญ",
                icon: "🌙",
              },
              {
                title: "การฟื้นตัว",
                desc: "ให้เวลาร่างกายซ่อมแซมตัวเอง",
                icon: "🧘",
              },
              {
                title: "ชีววิทยาของมนุษย์",
                desc: "ใช้ชีวิตให้สอดคล้องกับธรรมชาติ",
                icon: "🧬",
              },
              {
                title: "การปรับตัว",
                desc: "กลมกลืนกับวิวัฒนาการตามธรรมชาติ",
                icon: "🔄",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="group rounded-3xl border border-white/8 bg-white/5 p-6 transition hover:border-[#a3e635]/30 hover:bg-[#a3e635]/5">
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-[#a3e635]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-12 rounded-3xl border border-[#a3e635]/20 bg-gradient-to-r from-[#a3e635]/10 to-transparent p-8 text-center">
              <p className="text-lg leading-relaxed text-white/80 sm:text-xl">
                Autophagy ไม่ใช่เป้าหมาย
                <br />
                <span className="font-bold text-[#a3e635]">
                  แต่คือผลลัพธ์ของการใช้ชีวิตอย่างเหมาะสม
                </span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================== */}
      {/*  IF IS A TOOL                                               */}
      {/* ========================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111f1a] to-[#0d1a15] py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Intermittent Fasting เป็นเพียง
                <span className="text-[#fbbf24]">เครื่องมือ</span>
                <br />
                <span className="text-white/40">ไม่ใช่ศาสนา</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-14 space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <p className="text-lg leading-loose text-white/70">
                  ผมไม่ได้สร้าง Adaptive Fasting Coach
                  เพื่อทำให้ทุกคนอดอาหารนานขึ้น หรือแข่งกันลดน้ำหนัก
                  หรือแข่งกันว่าใครทรมานได้มากกว่ากัน
                </p>
              </div>

              <div className="rounded-3xl border border-[#a3e635]/20 bg-[#a3e635]/5 p-8">
                <p className="text-lg leading-loose text-white/80">
                  ผมสร้างมันขึ้นมาเพื่อช่วยให้ผู้คน
                  <span className="font-bold text-[#a3e635]">
                    เรียนรู้ที่จะฟังร่างกายตัวเอง
                  </span>
                  มากขึ้น
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-3xl">🌅</p>
                  <p className="mt-3 text-sm text-white/60">
                    บางวันร่างกาย
                    <span className="font-semibold text-[#a3e635]">พร้อม</span>
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-3xl">🌙</p>
                  <p className="mt-3 text-sm text-white/60">
                    บางวันร่างกาย
                    <span className="font-semibold text-[#fbbf24]">
                      ไม่พร้อม
                    </span>
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-3xl">⏳</p>
                  <p className="mt-3 text-sm text-white/60">
                    บางช่วงชีวิตควร{" "}
                    <span className="font-semibold text-[#60a5fa]">Fast</span>
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-3xl">🍽️</p>
                  <p className="mt-3 text-sm text-white/60">
                    บางช่วงชีวิตควร{" "}
                    <span className="font-semibold text-[#f472b6]">Feed</span>
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-[#fbbf24]/20 bg-[#fbbf24]/5 p-8 text-center">
                <p className="text-xl font-bold text-[#fbbf24] sm:text-2xl">
                  ความยืดหยุ่น ความรู้จักผ่อนหนักผ่อนเบา
                </p>
                <p className="mt-2 text-lg text-white/60">
                  ต่างหากที่เป็นหัวใจของสุขภาพ
                </p>
                <p className="mt-4 text-sm text-white/40">
                  ไม่ใช่ความสุดโต่ง ไม่ใช่ความสมบูรณ์แบบ
                  และยิ่งไม่ใช่การตามกระแส
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================== */}
      {/*  TRUE STRENGTH                                              */}
      {/* ========================================================== */}
      <section className="relative overflow-hidden bg-[#0d1a15] py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#a3e635]">
                ความแข็งแรงที่แท้จริง
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                สุขภาพดีคืออะไร?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/50">
                ไม่ใช่แค่ผลเลือดที่สวย หรือเปอร์เซ็นต์ไขมันต่ำ
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "เดินได้",
              "วิ่งได้",
              "ยกได้",
              "แบกได้",
              "ปีนได้",
              "ลุกจากพื้นได้สบาย",
              "เล่นกับลูกหลานได้",
              "เดินทางด้วยเท้าได้",
              "ผจญภัยได้",
            ].map((ability, i) => (
              <Reveal key={ability} delay={i * 0.06}>
                <div className="flex items-center gap-3 rounded-2xl border border-[#a3e635]/15 bg-[#a3e635]/5 px-5 py-4 transition hover:border-[#a3e635]/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#a3e635]/20 text-sm font-bold text-[#a3e635]">
                    ✓
                  </div>
                  <span className="font-medium text-white/80">{ability}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <div className="mt-12 rounded-3xl bg-gradient-to-r from-[#2f6b54]/30 to-[#a3e635]/10 p-8 text-center sm:p-12">
              <p className="text-xl leading-relaxed text-white/80 sm:text-2xl">
                และ
                <span className="font-bold text-[#a3e635]">
                  พึ่งพาตัวเองได้ให้นานที่สุด
                </span>
              </p>
              <p className="mt-4 text-base text-white/50">
                นี่คือความหมายของความแข็งแรงที่แท้จริง
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================== */}
      {/*  PHILOSOPHY — Principles over Formulas                      */}
      {/* ========================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0d1a15] to-[#0a1410] py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#a3e635]">
                หลักการ
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                สอนให้เข้าใจหลักการ
                <br />
                <span className="text-white/40">ไม่ใช่สอนให้จำสูตร</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-14 space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <p className="text-lg leading-loose text-white/70">
                  เพราะมนุษย์ไม่เหมือนกัน — บางคนต้องการลดไขมัน
                  บางคนต้องการสร้างกล้ามเนื้อ
                  บางคนจำเป็นต้องทำทั้งสองอย่างคู่กัน
                  บางคนต้องการฟื้นฟูสุขภาพ
                  บางคนต้องการกลับมาใช้ชีวิตได้ตามปกติ
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-3xl">🔑</p>
                  <p className="mt-3 text-sm font-medium text-white/70">
                    สิ่งที่เหมาะกับคนหนึ่ง
                    <br />
                    อาจไม่เหมาะกับอีกคน
                  </p>
                </div>
                <div className="rounded-3xl border border-[#a3e635]/20 bg-[#a3e635]/5 p-6 text-center">
                  <p className="text-3xl">📖</p>
                  <p className="mt-3 text-sm font-medium text-[#a3e635]">
                    หลักการสามารถ
                    <br />
                    ปรับใช้ได้ตลอดชีวิต
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-3xl">🧭</p>
                  <p className="mt-3 text-sm font-medium text-white/70">
                    เรียนรู้จากตัวเอง
                    <br />
                    ไม่ใช่ลอกเลียนแบบ
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================== */}
      {/*  CREDIBILITY — Stats & Speaking                             */}
      {/* ========================================================== */}
      <section className="relative overflow-hidden bg-[#0a1410] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Stats */}
          <Reveal>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  value: 16,
                  suffix: "+",
                  label: "ปีประสบการณ์ดูแลลูกค้า",
                  unit: "ปี",
                },
                {
                  value: 1000,
                  suffix: "+",
                  label: "ลูกค้าที่ได้รับการดูแล",
                  unit: "คน",
                },
                {
                  value: 100,
                  suffix: "%",
                  label: "แนวทางที่ยึดหลักวิทยาศาสตร์",
                  unit: "",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center"
                >
                  <p className="text-4xl font-bold text-[#a3e635] sm:text-5xl">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                    />
                  </p>
                  <p className="mt-3 text-sm text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Speaker images */}
          <Reveal delay={0.2}>
            <div className="mt-16">
              <h3 className="mb-8 text-center text-xl font-bold text-white">
                ผลงานและการบรรยาย
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="group relative overflow-hidden rounded-3xl">
                  <Image
                    src="/landing/coach-speaking.jpg"
                    alt="Coach Roy บรรยายเรื่อง Intermittent Fasting"
                    width={600}
                    height={400}
                    className="h-[300px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <p className="text-sm font-semibold text-[#a3e635]">
                      งานบรรยาย
                    </p>
                    <p className="mt-1 text-lg font-bold text-white">
                      แบ่งปันความรู้เรื่อง Fasting & Health
                    </p>
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-3xl">
                  <Image
                    src="/landing/hospital-event.jpg"
                    alt="งานบรรยายที่โรงพยาบาลเชียงรายประชานุเคราะห์"
                    width={600}
                    height={400}
                    className="h-[300px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <p className="text-sm font-semibold text-[#a3e635]">
                      โรงพยาบาลเชียงรายประชานุเคราะห์
                    </p>
                    <p className="mt-1 text-lg font-bold text-white">
                      งานบรรยายความรู้ (2024)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================== */}
      {/*  TESTIMONIALS                                               */}
      {/* ========================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a1410] to-[#0d1a15] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#a3e635]">
                ผลลัพธ์จริง
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                ภาพและข้อความคำขอบคุณ
              </h2>
              <p className="mt-3 text-sm text-white/40">
                จากแฟนเพจ และลูกค้าส่วนหนึ่ง ที่อนุญาตให้นำมาเผยแพร่ได้
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal delay={0.1}>
              <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <div className="overflow-hidden">
                  <Image
                    src="/landing/testimonial-female.jpg"
                    alt="ผลลัพธ์จริงจากลูกค้า — ก่อนและหลังทำ IF 6 เดือน"
                    width={400}
                    height={500}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm leading-relaxed text-white/60">
                    &ldquo;โรคที่เป็นอยู่หายหมดเลยค่ะ ไมเกรน เหนื่อยง่าย หน้ามืด
                    กรดไหลย้อน โรคกระเพาะ ไหล่ติด เอ็นเข่าอักเสบ
                    ตอนนี้เป็นปกติแล้วค่ะ ดีใจมากๆเลยค่ะ&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#a3e635]/20 text-sm">
                      ⭐
                    </div>
                    <span className="text-sm font-medium text-white/50">
                      หลังทำ IF 6 เดือน
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <div className="overflow-hidden">
                  <Image
                    src="/landing/testimonials-collage.jpg"
                    alt="ผลลัพธ์จากลูกค้าหลายท่าน — before/after transformation"
                    width={400}
                    height={500}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm leading-relaxed text-white/60">
                    &ldquo;ผมทำมาได้ประมาณ 2 เดือนกว่าๆแล้วครับ
                    ขอบคุณพี่มากครับที่คอยให้ความรู้&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#a3e635]/20 text-sm">
                      ⭐
                    </div>
                    <span className="text-sm font-medium text-white/50">
                      ผลลัพธ์ภายใน 2 เดือน
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <div className="overflow-hidden">
                  <Image
                    src="/landing/testimonial-chat.jpg"
                    alt="ข้อความขอบคุณจากลูกค้า"
                    width={400}
                    height={500}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm leading-relaxed text-white/60">
                    &ldquo;ขอบคุณพี่รอยจากใจจริงๆ ที่ตลอด ปีกว่าๆ ได้ทำ fasting
                    จากคลิปของพี่รอยในยูทูป จนเปลี่ยนเป็นวิถีชีวิตไปแล้ว&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#a3e635]/20 text-sm">
                      ⭐
                    </div>
                    <span className="text-sm font-medium text-white/50">
                      เปลี่ยนเป็นวิถีชีวิต
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/*  ULTIMATE GOAL                                              */}
      {/* ========================================================== */}
      <section className="relative overflow-hidden bg-[#0d1a15] py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#a3e635]">
                เป้าหมายสูงสุด
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                สิ่งที่ผมต้องการสร้าง
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 space-y-4">
              <div className="rounded-3xl border border-[#f87171]/10 bg-[#f87171]/5 p-6">
                <p className="text-white/60">
                  <span className="mr-2 text-[#f87171]">✗</span>
                  ไม่ใช่คนที่พึ่งพาโค้ชตลอดไป
                </p>
              </div>
              <div className="rounded-3xl border border-[#f87171]/10 bg-[#f87171]/5 p-6">
                <p className="text-white/60">
                  <span className="mr-2 text-[#f87171]">✗</span>
                  ไม่ใช่คนที่ต้องรอคำตอบจากกูรูตลอดไป
                </p>
              </div>
              <div className="rounded-3xl border border-[#a3e635]/20 bg-[#a3e635]/5 p-6">
                <p className="text-lg font-medium text-white/80">
                  <span className="mr-2 text-[#a3e635]">✓</span>
                  แต่คือ
                  <span className="font-bold text-[#a3e635]">
                    คนที่เข้าใจร่างกายตัวเอง
                  </span>{" "}
                  เหมือนเห็นลายมือตัวเอง
                </p>
              </div>
              <div className="rounded-3xl border border-[#a3e635]/20 bg-[#a3e635]/5 p-6">
                <p className="text-lg font-medium text-white/80">
                  <span className="mr-2 text-[#a3e635]">✓</span>
                  รู้ว่าอะไรไม่ควรทำ ก่อนที่จะรู้ว่าควรทำอะไร
                </p>
              </div>
              <div className="rounded-3xl border border-[#a3e635]/20 bg-[#a3e635]/5 p-6">
                <p className="text-lg font-medium text-white/80">
                  <span className="mr-2 text-[#a3e635]">✓</span>
                  คนที่
                  <span className="font-bold text-[#a3e635]">
                    ดูแลตัวเองได้ แม้ไม่มีใครคอยบอก
                  </span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================== */}
      {/*  GRAND FINALE — Final Message                               */}
      {/* ========================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0d1a15] to-[#070f0d] py-32 sm:py-40">
        {/* Glow */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(163,230,53,0.3) 0%, transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <div className="space-y-8">
              <p className="text-lg text-white/50">เป้าหมายสูงสุดที่มนุษย์ควรไปถึง</p>

              <div className="space-y-3 text-lg text-white/40">
                <p>ไม่ใช่การมีซิกแพค</p>
                <p>ไม่ใช่การมีน้ำหนักตามอุดมคติ</p>
                <p>ไม่ใช่การอดอาหารได้นานที่สุด</p>
              </div>

              <div className="mx-auto max-w-3xl rounded-[32px] border border-[#a3e635]/20 bg-gradient-to-br from-[#a3e635]/10 to-[#2f6b54]/10 p-10 sm:p-14">
                <p className="text-2xl font-bold leading-relaxed text-white sm:text-3xl">
                  แต่คือ การมีชีวิตที่
                  <span className="text-[#a3e635]">ปรับตัวได้ดีพอ</span>
                  <br />
                  จน
                  <span className="text-[#a3e635]">แข็งแรงพอ</span>
                  ที่จะทำในสิ่งที่คุณรัก
                </p>
                <p className="mt-6 text-xl text-white/60">
                  มีอิสระพอที่จะใช้ชีวิตในแบบที่คุณเลือก
                </p>
                <p className="mt-2 text-xl text-white/60">
                  และมีสุขภาพดีพอที่จะเดินทางไปถึงปลายทางนั้น
                  <span className="font-bold text-white">ด้วยตัวเอง</span>
                </p>
              </div>

              <p className="text-base text-white/30">
                นี่คือเหตุผลที่ Adaptive Fasting Coach และ Fasting Wisdom ถูกสร้างขึ้น
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================== */}
      {/*  CTA                                                        */}
      {/* ========================================================== */}
      <section className="relative overflow-hidden bg-[#070f0d] py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#2f6b54]/20 to-[#a3e635]/10 p-10 sm:p-14">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#a3e635]/20">
                <TreePine size={30} className="text-[#a3e635]" />
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                พร้อมเริ่มต้นหรือยัง?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-white/50">
                เช็กสัญญาณร่างกายวันนี้ แล้วค่อยเลือกชั่วโมง Fast
                ที่เหมาะกับชีวิตจริงของคุณ
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/onboarding"
                  className="group flex h-14 items-center gap-3 rounded-2xl bg-[#a3e635] px-8 text-base font-bold text-[#0a1410] shadow-[0_8px_32px_rgba(163,230,53,0.3)] transition-all hover:shadow-[0_12px_48px_rgba(163,230,53,0.4)] hover:translate-y-[-2px]"
                >
                  เริ่มประเมินวันนี้
                  <MoveRight
                    size={20}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="/login"
                  className="flex h-14 items-center gap-2 rounded-2xl border border-white/20 px-8 text-base font-medium text-white/80 transition hover:bg-white/10"
                >
                  เข้าสู่ระบบ
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================== */}
      {/*  KEYFRAME ANIMATIONS                                        */}
      {/* ========================================================== */}
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
        }
        @keyframes scrollDot {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(10px);
            opacity: 0.3;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
