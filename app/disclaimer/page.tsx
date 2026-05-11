import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="rounded-[32px] border border-[#efc7b2] bg-[#fff3ed] p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#7d351f]">
          <ShieldAlert size={24} aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-normal text-[#7d351f]">
          ข้อจำกัดด้านความปลอดภัย
        </h1>
        <p className="mt-4 text-base leading-8 text-[#7d351f]">
          แอปนี้ให้คำแนะนำด้านสุขภาพทั่วไปเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์
          หากรู้สึกเวียนหัว อ่อนแรง หน้ามืด เป็นลม หรือไม่สบาย ให้หยุด Fast
          ทันที และควรปรึกษาบุคลากรทางการแพทย์หากตั้งครรภ์ ให้นมบุตร
          เป็นเบาหวาน อายุต่ำกว่า 18 ปี ใช้ยา หรือมีโรคประจำตัว
        </p>
        <div className="mt-6 grid gap-3 text-sm leading-6 text-[#7d351f] sm:grid-cols-2">
          <p className="rounded-2xl bg-white p-4">
            แอปนี้ไม่วินิจฉัย รักษา หรืออ้างผลลัพธ์ทางโรค และไม่รับประกันการลดน้ำหนัก
          </p>
          <p className="rounded-2xl bg-white p-4">
            หากมีอาการเวียนหัว อ่อนแรง หน้ามืด ใจสั่น หรือรู้สึกไม่ปกติ ให้หยุด Fast ทันที
          </p>
        </div>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-[#315f56] px-5 text-sm font-semibold text-white"
        >
          กลับไปแดชบอร์ด
        </Link>
      </div>
    </section>
  );
}
