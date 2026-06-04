-- คำสั่ง SQL สำหรับตั้งค่าตารางใน Supabase ให้รองรับการบันทึกค่าน้ำหนักและรอบเอว
-- ให้ copy โค้ดด้านล่างนี้ไปวางใน "SQL Editor" ของ Supabase แล้วกด "Run" ครับ

-- 1. อัปเดตตาราง profiles (สำหรับข้อมูลส่วนตัว)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS weight_kg DECIMAL,
ADD COLUMN IF NOT EXISTS waist_cm DECIMAL;

-- 2. อัปเดตตาราง daily_check_ins (สำหรับข้อมูลรายวัน)
ALTER TABLE daily_check_ins 
ADD COLUMN IF NOT EXISTS current_weight_kg DECIMAL,
ADD COLUMN IF NOT EXISTS current_waist_cm DECIMAL,
ADD COLUMN IF NOT EXISTS symptoms JSONB DEFAULT '{}'::jsonb;

-- 3. ตรวจสอบและสร้าง Unique Constraint เพื่อให้การบันทึกซ้ำวันเดิมเป็นการอัปเดต (Upsert)
-- หมายเหตุ: หากมี constraint เดิมอยู่แล้วอาจจะต้องข้ามขั้นตอนนี้
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'daily_check_ins_user_id_date_iso_key'
    ) THEN
        ALTER TABLE daily_check_ins 
        ADD CONSTRAINT daily_check_ins_user_id_date_iso_key UNIQUE (user_id, date_iso);
    END IF;
END $$;
