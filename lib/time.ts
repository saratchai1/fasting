export function todayISO(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function formatThaiDate(dateISO: string) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
  }).format(new Date(`${dateISO}T00:00:00`));
}

export function formatClock(dateISO: string) {
  return new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateISO));
}

export function formatDuration(ms: number) {
  const safeMs = Math.max(0, ms);
  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export function addHoursToTime(time: string, hours: number) {
  const [hour = "0", minute = "0"] = time.split(":");
  const totalMinutes =
    Number(hour) * 60 + Number(minute) + Math.round(hours * 60);
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const nextHour = Math.floor(normalized / 60);
  const nextMinute = normalized % 60;

  return `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(
    2,
    "0",
  )}`;
}

export function buildEatingWindowSuggestion(
  lastMealTime: string,
  fastingHours: number,
) {
  if (fastingHours <= 0) {
    return "วันนี้ไม่ต้องตั้งหน้าต่าง Fast เน้นมื้ออาหารที่อิ่มพอดี ดื่มน้ำ และพักให้พอ";
  }

  const eatingHours = 24 - fastingHours;

  if (!lastMealTime) {
    return `จัดหน้าต่างกินประมาณ ${eatingHours} ชั่วโมง และปิดมื้อสุดท้ายให้ชัดเจน`;
  }

  const fastingEndsAt = addHoursToTime(lastMealTime, fastingHours);
  const eatingEndsAt = addHoursToTime(fastingEndsAt, eatingHours);

  return `ถ้ามื้อสุดท้ายจบ ${lastMealTime} น. ให้เริ่มกินได้ราว ${fastingEndsAt} น. และจบหน้าต่างกินประมาณ ${eatingEndsAt} น.`;
}
