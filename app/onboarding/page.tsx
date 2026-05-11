import { OnboardingForm } from "@/components/OnboardingForm";

export default function OnboardingPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-6">
        <p className="text-sm font-semibold text-[#315f56]">Onboarding</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-[#24211d]">
          ตั้งค่าโปรไฟล์ของคุณ
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#756b5d]">
          ข้อมูลนี้ใช้กำหนดเพดานความเข้มของการ Fast ใน MVP และเก็บไว้ในเครื่องของคุณเท่านั้น
        </p>
      </div>
      <OnboardingForm />
    </section>
  );
}
