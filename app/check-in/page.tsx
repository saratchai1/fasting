import { CheckInForm } from "@/components/CheckInForm";

export default function CheckInPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-6">
        <p className="text-sm font-semibold text-[#315f56]">Daily check-in</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-[#24211d]">
          เช็กอินประจำวัน
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#756b5d]">
          ใส่ข้อมูลวันนี้เพื่อให้ระบบคำนวณคะแนนความพร้อมและชั่วโมง Fast ที่เหมาะกว่าเดิม
        </p>
      </div>
      <CheckInForm />
    </section>
  );
}
