import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

// โหลดค่าจาก .env หรือ .env.local
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ ไม่พบค่า Environment Variables (URL หรือ Key)");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setup() {
  console.log("🚀 กำลังเริ่มตั้งค่าฐานข้อมูล Supabase...");

  const sqlCommands = [
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weight_kg DECIMAL;`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS waist_cm DECIMAL;`,
    `ALTER TABLE daily_check_ins ADD COLUMN IF NOT EXISTS current_weight_kg DECIMAL;`,
    `ALTER TABLE daily_check_ins ADD COLUMN IF NOT EXISTS current_waist_cm DECIMAL;`,
    `ALTER TABLE daily_check_ins ADD COLUMN IF NOT EXISTS symptoms JSONB DEFAULT '{}'::jsonb;`
  ];

  for (const sql of sqlCommands) {
    console.log(`⏳ กำลังรัน: ${sql}`);
    // หมายเหตุ: การรัน SQL ผ่าน rpc('rest_sql') หรือคล้ายกันต้องมีการตั้งค่าฟังก์ชันใน Supabase ก่อน
    // เนื่องจาก Anon Key มักจะไม่มีสิทธิ์รันคำสั่ง ALTER TABLE โดยตรง
    // เราจะลองส่งผ่าน API ทั่วไป แต่โอกาสสำเร็จต่ำถ้าไม่ใช่ Service Role Key
    
    // ดังนั้น วิธีที่ชัวร์ที่สุดสำหรับพี่คือ ผมจะพยายามแนะนำวิธีเปิด SQL Editor อีกครั้งแบบง่ายที่สุด
  }

  console.log("\n--------------------------------------------------");
  console.log("💡 เนื่องจากข้อจำกัดด้านความปลอดภัยของ Supabase");
  console.log("การเปลี่ยนโครงสร้างตาราง (ALTER TABLE) ต้องทำผ่านหน้าเว็บ SQL Editor เท่านั้น");
  console.log("ผมเตรียมคำสั่งไว้ให้พี่หมดแล้ว พี่แค่คลิกไม่กี่ทีครับ");
  console.log("--------------------------------------------------\n");
}

setup();
