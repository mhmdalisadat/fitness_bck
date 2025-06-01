// تعریف ثابت‌های مشترک بین مدل‌ها

// گروه‌های عضلانی
export const MUSCLE_GROUPS = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "legs",
  "abs",
  "full_body",
] as const;

// سطح سختی
export const DIFFICULTY_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
  "professional",
] as const;

// تجهیزات مورد نیاز
export const EQUIPMENT_TYPES = [
  "none",
  "dumbbell",
  "barbell",
  "kettlebell",
  "resistance_band",
  "machine",
  "cable",
  "bodyweight",
  "bench",
  "pull_up_bar",
  "dip_bars",
] as const;

// اهداف تمرینی
export const TRAINING_GOALS = [
  "weight_loss",
  "muscle_gain",
  "strength",
  "endurance",
  "flexibility",
  "general_fitness",
] as const;

// نوع حرکت
export const MOVEMENT_TYPES = [
  "compound",
  "isolation",
  "cardio",
  "stretch",
  "plyometric",
] as const;

// روزهای هفته
export const WEEK_DAYS = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;

// زمان‌های تمرین
export const TRAINING_TIMES = [
  "morning",
  "afternoon",
  "evening",
  "night",
] as const;

export const TRAINING_EXPERIENCE_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export const MEDICAL_CONDITIONS = [
  "heart_disease",
  "diabetes",
  "hypertension",
  "asthma",
  "arthritis",
  "none",
] as const;

export const INJURIES = [
  "knee",
  "shoulder",
  "back",
  "wrist",
  "ankle",
  "none",
] as const;
