import { buildEatingWindowSuggestion } from "@/lib/time";
import type {
  DailyCheckIn,
  FastingExperience,
  RecommendationLevel,
  RecommendationResult,
  RecommendedHours,
  UserProfile,
} from "@/types/fasting";

const MEDICAL_DISCLAIMER =
  "แอปนี้ให้คำแนะนำด้านสุขภาพทั่วไปเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์ หากรู้สึกเวียนหัว อ่อนแรง หน้ามืด เป็นลม หรือไม่สบาย ให้หยุด Fast ทันที และควรปรึกษาบุคลากรทางการแพทย์หากตั้งครรภ์ ให้นมบุตร เป็นเบาหวาน อายุต่ำกว่า 18 ปี ใช้ยา หรือมีโรคประจำตัว";

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function capRecommendedHours(hours: RecommendedHours, cap: RecommendedHours) {
  if (hours === 0) {
    return 0;
  }

  return Math.min(hours, cap) as RecommendedHours;
}

function maxHoursForExperience(
  experience: FastingExperience,
): RecommendedHours {
  if (experience === "advanced") {
    return 20;
  }

  if (experience === "intermediate") {
    return 18;
  }

  return 16;
}

function levelForHours(hours: RecommendedHours): RecommendationLevel {
  if (hours === 0) {
    return "rest";
  }

  if (hours <= 14) {
    return "light";
  }

  if (hours === 16) {
    return "standard";
  }

  if (hours === 18) {
    return "strong";
  }

  return "advanced";
}

function hoursFromScore(
  score: number,
  experience: FastingExperience,
): RecommendedHours {
  if (score >= 85) {
    return experience === "advanced" ? 20 : 18;
  }

  if (score >= 70) {
    return 16;
  }

  if (score >= 55) {
    return 14;
  }

  if (score >= 40) {
    return 12;
  }

  return 0;
}

function buildCoachMessage(hours: RecommendedHours) {
  if (hours === 0) {
    return "วันนี้ไม่ควรฝืน Fast ยาว ให้ร่างกายได้พักก่อน พรุ่งนี้ค่อยกลับมาประเมินใหม่แบบใจเย็น";
  }

  if (hours <= 12) {
    return "วันนี้ไปแบบเบา ๆ ชนะด้วยความสม่ำเสมอ ไม่ต้องเอาชนะร่างกาย";
  }

  if (hours === 14) {
    return "วันนี้เหมาะกับ Fast ระดับประคองจังหวะ โฟกัสน้ำ เกลือแร่ และมื้อแรกที่มีโปรตีนพอ";
  }

  if (hours === 16) {
    return "วันนี้ร่างกายคุณเหมาะกับการ Fast ประมาณ 16 ชั่วโมง ทำให้เรียบง่ายและหยุดทันทีถ้ามีสัญญาณผิดปกติ";
  }

  if (hours === 18) {
    return "วันนี้พร้อมกว่าค่าเฉลี่ย ลอง Fast แบบเข้มขึ้นได้ แต่ยังต้องฟังสัญญาณร่างกายตลอดทาง";
  }

  return "วันนี้ readiness สูงและคุณมีประสบการณ์ระดับ Advanced จึงลอง 20 ชั่วโมงได้ถ้าคุ้นเคยและไม่มีอาการผิดปกติ";
}

function hasHardStopRisk(profile: UserProfile) {
  const warnings = profile.healthWarnings;

  return (
    profile.age < 18 ||
    warnings.under18 ||
    warnings.pregnant ||
    warnings.breastfeeding ||
    warnings.bloodSugarMedication ||
    warnings.eatingDisorderHistory
  );
}

function hasMedicalRisk(profile: UserProfile) {
  const warnings = profile.healthWarnings;

  return warnings.diabetes || warnings.chronicDisease;
}

function restRecommendation(
  score: number,
  reasons: string[],
  warnings: string[],
  lastMealTime: string,
): RecommendationResult {
  const readinessScore = clampScore(score);

  return {
    readinessScore,
    recommendedHours: 0,
    level: "rest",
    reasons,
    warnings,
    coachMessage: buildCoachMessage(0),
    eatingWindowSuggestion: buildEatingWindowSuggestion(lastMealTime, 0),
  };
}

export function calculateFastingRecommendation(
  profile: UserProfile,
  dailyCheckIn: DailyCheckIn,
): RecommendationResult {
  let score = 70;
  let cap = maxHoursForExperience(profile.fastingExperience);
  const reasons: string[] = [];
  const warnings: string[] = [];

  if (hasHardStopRisk(profile)) {
    reasons.push("ข้อมูลสุขภาพอยู่ในกลุ่มที่ไม่ควรเริ่ม Fast เอง");
    warnings.push(MEDICAL_DISCLAIMER);

    return restRecommendation(
      20,
      reasons,
      warnings,
      dailyCheckIn.lastMealTime,
    );
  }

  if (hasMedicalRisk(profile)) {
    score -= 25;
    cap = 12;
    reasons.push("มีภาวะสุขภาพที่ควรปรึกษาแพทย์ก่อนปรับเวลาการ Fast");
    warnings.push(MEDICAL_DISCLAIMER);
  }

  if (dailyCheckIn.sleepHours < 5) {
    score -= 25;
    cap = Math.min(cap, 12) as RecommendedHours;
    reasons.push("นอนน้อยกว่า 5 ชั่วโมง วันนี้ควรลดความเข้มของการ Fast");
  } else if (dailyCheckIn.sleepHours <= 6) {
    score -= 15;
    cap = Math.min(cap, 14) as RecommendedHours;
    reasons.push("การนอนยังไม่เต็มที่ จึงควรเลือกหน้าต่าง Fast ที่สั้นลง");
  } else if (dailyCheckIn.sleepHours <= 8) {
    score += 10;
    reasons.push("ชั่วโมงการนอนอยู่ในช่วงที่ช่วยให้ร่างกายพร้อมขึ้น");
  }

  if (dailyCheckIn.sleepQuality <= 2) {
    score -= 10;
    reasons.push("คุณภาพการนอนต่ำ ร่างกายอาจรับความเครียดจาก Fast ได้น้อยลง");
  }

  if (dailyCheckIn.stress >= 4) {
    score -= 10;
    reasons.push("ความเครียดสูง วันนี้ควรเลี่ยงการฝืน Fast ยาว");
  }

  if (dailyCheckIn.energy <= 2) {
    score -= 15;
    reasons.push("พลังงานต่ำ ควรให้ความสำคัญกับการฟื้นตัวก่อน");
  }

  if (dailyCheckIn.hunger >= 4) {
    score -= 10;
    reasons.push("ความหิวเริ่มสูง จึงควรใช้แผนที่ยืดหยุ่นกว่าเดิม");
  }

  if (dailyCheckIn.symptoms.dizziness || dailyCheckIn.symptoms.weakness) {
    reasons.push("มีอาการเวียนหัวหรืออ่อนแรง ซึ่งเป็นสัญญาณให้หยุด Fast");
    warnings.push("หยุด Fast และกินอาหาร/ดื่มน้ำทันทีหากรู้สึกเวียนหัว อ่อนแรง หน้ามืด หรือไม่สบาย");

    return restRecommendation(
      score - 30,
      reasons,
      warnings,
      dailyCheckIn.lastMealTime,
    );
  }

  if (dailyCheckIn.exerciseYesterday === "heavy") {
    score -= 10;
    cap = Math.min(cap, 16) as RecommendedHours;
    reasons.push("เมื่อวานออกกำลังกายหนัก ควรเผื่อพลังงานสำหรับการฟื้นตัว");
  }

  if (dailyCheckIn.coffeeCups >= 4) {
    score -= 5;
    reasons.push("กาแฟ 4 แก้วขึ้นไปอาจเพิ่มใจสั่นหรือหิวเร็วในบางคน");
  }

  if (dailyCheckIn.coffeeWithSugarOrMilk) {
    reasons.push("กาแฟที่ใส่น้ำตาลหรือนมอาจนับเป็นพลังงานระหว่างช่วง Fast");
  }

  if (
    dailyCheckIn.menstrualPhase === "period_day_1_2" &&
    dailyCheckIn.symptoms.cramps
  ) {
    score -= 15;
    cap = Math.min(cap, 12) as RecommendedHours;
    reasons.push("ช่วงประจำเดือนวันแรก ๆ และมีปวดท้อง ควรเลือกพักหรือ Fast สั้น");
  }

  if (dailyCheckIn.menstrualPhase === "luteal_pms") {
    score -= 10;
    cap = Math.min(cap, score >= 70 ? 16 : 14) as RecommendedHours;
    reasons.push("ช่วง Luteal/PMS มักไวต่อความเครียดและความหิวมากขึ้น");
  }

  if (
    dailyCheckIn.menstrualPhase === "follicular" &&
    dailyCheckIn.sleepHours >= 7 &&
    dailyCheckIn.energy >= 4
  ) {
    score += 5;
    reasons.push("ช่วง Follicular พร้อมกับการนอนและพลังงานดี รองรับแผนมาตรฐานได้ดี");
  }

  const readinessScore = clampScore(score);
  const scoreBasedHours = hoursFromScore(
    readinessScore,
    profile.fastingExperience,
  );
  const recommendedHours = capRecommendedHours(scoreBasedHours, cap);

  return {
    readinessScore,
    recommendedHours,
    level: levelForHours(recommendedHours),
    reasons:
      reasons.length > 0
        ? reasons
        : ["ข้อมูลวันนี้อยู่ในเกณฑ์สมดุล สามารถใช้แผนมาตรฐานได้"],
    warnings,
    coachMessage: buildCoachMessage(recommendedHours),
    eatingWindowSuggestion: buildEatingWindowSuggestion(
      dailyCheckIn.lastMealTime,
      recommendedHours,
    ),
  };
}

export { MEDICAL_DISCLAIMER };
