import {
  ArrowRight,
  BarChart3,
  Clock3,
  HeartPulse,
  Moon,
  ShieldCheck,
  Sunrise,
  Utensils,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="relative min-h-[82svh] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1800&q=84')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08231f]/92 via-[#0b3d35]/72 to-[#113f37]/22" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#f2f7ef] to-transparent" />

        <div className="relative mx-auto flex min-h-[82svh] max-w-6xl items-center px-4 py-14 sm:px-6">
          <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/14 px-3 py-1 text-sm backdrop-blur">
                <HeartPulse size={15} aria-hidden="true" />
                Fast แบบยั่งยืน ไม่ฝืนร่างกาย
              </div>
              <h1 className="mt-5 text-5xl font-semibold tracking-normal sm:text-6xl">
                Adaptive Fasting Coach
              </h1>
              <p className="mt-5 max-w-xl text-xl leading-9 text-white/90">
                เช็กสัญญาณร่างกายวันนี้ แล้วค่อยเลือกชั่วโมง Fast ที่เหมาะกับชีวิตจริง
              </p>
              <div className="mt-7 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "นอน", icon: Moon },
                  { label: "พลังงาน", icon: HeartPulse },
                  { label: "มื้ออาหาร", icon: Utensils },
                  { label: "ปลอดภัย", icon: ShieldCheck },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex min-h-20 flex-col justify-center rounded-2xl border border-white/20 bg-white/13 px-4 backdrop-blur"
                    >
                      <Icon size={20} aria-hidden="true" />
                      <span className="mt-2 text-sm font-semibold">{item.label}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/onboarding"
                  className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#d9f99d] px-5 text-sm font-semibold text-[#12312b] shadow-sm transition hover:bg-[#ecfccb]"
                >
                  เริ่มประเมินวันนี้
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link
                  href="/disclaimer"
                  className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-white/35 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <ShieldCheck size={18} aria-hidden="true" />
                  ข้อควรระวัง
                </Link>
              </div>
            </div>

            <div className="hidden justify-end lg:flex" aria-hidden="true">
              <div className="relative h-[430px] w-[430px]">
                <div className="absolute inset-0 rounded-full border border-white/25 bg-white/10 shadow-2xl backdrop-blur-md" />
                <div className="absolute inset-10 rounded-full border border-[#d9f99d]/55" />
                <div className="absolute left-1/2 top-1/2 grid h-40 w-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#d9f99d] text-[#12312b] shadow-xl">
                  <div className="text-center">
                    <Sunrise className="mx-auto" size={34} />
                    <p className="mt-2 text-4xl font-semibold">24h</p>
                    <p className="text-sm font-semibold">body rhythm</p>
                  </div>
                </div>
                <div className="absolute left-8 top-16 rounded-2xl bg-white px-4 py-3 text-[#12312b] shadow-lg">
                  <Moon size={22} />
                  <p className="mt-2 text-sm font-semibold">นอนพอ</p>
                </div>
                <div className="absolute right-2 top-32 rounded-2xl bg-[#ffcf8a] px-4 py-3 text-[#4a2a05] shadow-lg">
                  <Utensils size={22} />
                  <p className="mt-2 text-sm font-semibold">กินเป็นเวลา</p>
                </div>
                <div className="absolute bottom-20 left-4 rounded-2xl bg-[#9ee7d7] px-4 py-3 text-[#0f3f36] shadow-lg">
                  <HeartPulse size={22} />
                  <p className="mt-2 text-sm font-semibold">ฟังร่างกาย</p>
                </div>
                <div className="absolute bottom-12 right-12 rounded-2xl bg-white px-4 py-3 text-[#12312b] shadow-lg">
                  <ShieldCheck size={22} />
                  <p className="mt-2 text-sm font-semibold">ไม่ฝืน</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="-mt-10 px-4 pb-4 sm:px-6">
        <div className="relative mx-auto grid max-w-6xl gap-3 rounded-[28px] border border-[#d9eadf] bg-white p-4 shadow-[0_18px_60px_rgba(18,49,43,0.12)] md:grid-cols-3">
          <div className="rounded-2xl bg-[#e9f8ef] p-5">
            <h2 className="mt-2 text-xl font-semibold text-[#17352f]">
              สุขภาพยั่งยืนคือจังหวะ ไม่ใช่การฝืน
            </h2>
          </div>
          <div className="rounded-2xl bg-[#fff3dd] p-5">
            <p className="text-sm font-semibold text-[#9a5a10]">วันนี้พร้อมแค่ไหน</p>
            <p className="mt-2 text-sm leading-6 text-[#5f513f]">
              เช็กการนอน พลังงาน ความเครียด อาการ และรอบเดือนก่อนเริ่ม Fast
            </p>
          </div>
          <div className="rounded-2xl bg-[#e3f6ff] p-5">
            <p className="text-sm font-semibold text-[#17637d]">คำแนะนำที่ยืดหยุ่น</p>
            <p className="mt-2 text-sm leading-6 text-[#435b63]">
              บางวัน 16 ชั่วโมง บางวัน 12 ชั่วโมง และบางวันควรพัก
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3">
        <article className="rounded-[24px] border border-[#d9eadf] bg-white p-5 shadow-sm">
          <Clock3 className="text-[#2f6b54]" size={24} aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold">แนะนำชั่วโมง Fast วันนี้</h2>
          <p className="mt-2 text-sm leading-6 text-[#5f6d63]">
            เลือกพัก, 12, 14, 16, 18 หรือ 20 ชั่วโมงตามความพร้อมของร่างกาย
          </p>
        </article>
        <article className="rounded-[24px] border border-[#d9eadf] bg-white p-5 shadow-sm">
          <BarChart3 className="text-[#2f6b54]" size={24} aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold">เก็บประวัติและอินไซต์</h2>
          <p className="mt-2 text-sm leading-6 text-[#5f6d63]">
            ดูคะแนนเฉลี่ย แนวโน้มน้ำหนัก รอบเอว และเหตุผลที่เจอบ่อย
          </p>
        </article>
        <article className="rounded-[24px] border border-[#d9eadf] bg-white p-5 shadow-sm">
          <ShieldCheck className="text-[#2f6b54]" size={24} aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold">ปลอดภัยไว้ก่อน</h2>
          <p className="mt-2 text-sm leading-6 text-[#5f6d63]">
            เตือนเมื่อมีความเสี่ยงหรืออาการที่ไม่ควรฝืน Fast ต่อ
          </p>
        </article>
      </section>
    </>
  );
}
