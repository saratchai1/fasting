import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing environment variables",
        details: {
          url: !!supabaseUrl,
          key: !!supabaseAnonKey,
        },
      },
      { status: 500 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // ทดสอบดึงข้อมูล 1 แถวจากตาราง connection_test ตามที่ระบุ
    // หมายเหตุ: พี่ต้องสร้างตารางชื่อ connection_test ใน Supabase ก่อนนะครับ
    const { error } = await supabase.from("connection_test").select("*").limit(1);

    if (error) {
      // ถ้าไม่มีตาราง connection_test จะเกิด error แต่อย่างน้อยก็แปลว่าคุยกับ Supabase รู้เรื่องแล้ว
      return NextResponse.json(
        {
          ok: false,
          message: "Supabase connected but table query failed",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to initialize Supabase client",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
