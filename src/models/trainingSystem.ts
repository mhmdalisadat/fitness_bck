import mongoose, { Schema, Document } from "mongoose";

// تعریف مدل سیستم تمرینی
const TrainingSystemSchema = new Schema(
  {
    system_type: {
      type: String,
      required: [true, "نوع سیستم تمرینی الزامی است"],
      enum: [
        "hypertrophy",
        "strength",
        "endurance",
        "hybrid",
        "functional",
        "powerlifting",
        "weightlifting",
        "crossfit",
        "pilates",
        "yoga",
      ],
      unique: true,
    },
    system_name: {
      type: String,
      required: [true, "نام سیستم تمرینی الزامی است"],
      unique: true,
    },
    system_description: {
      type: String,
      required: [true, "توضیحات سیستم تمرینی الزامی است"],
    },
    system_text: {
      hypertrophy: { type: String, default: "هایپرتروفی" },
      strength: { type: String, default: "قدرت" },
      endurance: { type: String, default: "استقامتی" },
      hybrid: { type: String, default: "ترکیبی" },
      functional: { type: String, default: "فانکشنال" },
      powerlifting: { type: String, default: "پاورلیفتینگ" },
      weightlifting: { type: String, default: "بدنسازی با وزنه" },
      crossfit: { type: String, default: "کراس‌فیت" },
      pilates: { type: String, default: "پیلاتس" },
      yoga: { type: String, default: "یوگا" },
    },
    system_description_text: {
      hypertrophy: {
        type: String,
        default: "افزایش حجم عضلات با تمرینات مقاومتی",
      },
      strength: {
        type: String,
        default: "افزایش قدرت عضلانی با تمرینات سنگین",
      },
      endurance: {
        type: String,
        default: "افزایش توانایی تحمل فعالیت‌های طولانی مدت",
      },
      hybrid: { type: String, default: "ترکیب تمرینات قدرتی و استقامتی" },
      functional: {
        type: String,
        default: "تمرینات برای بهبود عملکرد حرکتی روزانه",
      },
      powerlifting: {
        type: String,
        default: "تمرینات برای افزایش قدرت در حرکات اصلی",
      },
      weightlifting: {
        type: String,
        default: "تمرینات برای بهبود تکنیک و قدرت وزنه‌برداری",
      },
      crossfit: {
        type: String,
        default: "تمرینات متنوع و شدید برای تناسب کلی",
      },
      pilates: {
        type: String,
        default: "تمرینات برای انعطاف‌پذیری و قدرت مرکزی",
      },
      yoga: { type: String, default: "تمرینات برای انعطاف‌پذیری و آرامش ذهنی" },
    },
    system_equipment: [
      {
        type: String,
        enum: [
          "none",
          "dumbbell",
          "barbell",
          "kettlebell",
          "machine",
          "cable",
          "bodyweight",
          "yoga_mat",
          "pilates_equipment",
        ],
      },
    ],
    system_difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "professional"],
      required: true,
    },
    system_difficulty_text: {
      beginner: { type: String, default: "مبتدی" },
      intermediate: { type: String, default: "متوسط" },
      advanced: { type: String, default: "پیشرفته" },
      professional: { type: String, default: "حرفه‌ای" },
    },
    system_is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ایجاد ایندکس برای جستجوی سریع‌تر
TrainingSystemSchema.index({ system_type: 1 }, { unique: true });
TrainingSystemSchema.index({ system_name: 1 }, { unique: true });
TrainingSystemSchema.index({ system_difficulty: 1 });

// تعریف اینترفیس برای تایپ‌اسکریپت
export interface ITrainingSystem extends Document {
  system_type:
    | "hypertrophy"
    | "strength"
    | "endurance"
    | "hybrid"
    | "functional"
    | "powerlifting"
    | "weightlifting"
    | "crossfit"
    | "pilates"
    | "yoga";
  system_name: string;
  system_description: string;
  system_equipment: Array<
    | "none"
    | "dumbbell"
    | "barbell"
    | "kettlebell"
    | "machine"
    | "cable"
    | "bodyweight"
    | "yoga_mat"
    | "pilates_equipment"
  >;
  system_difficulty: "beginner" | "intermediate" | "advanced" | "professional";
  system_is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const TrainingSystem = mongoose.model<ITrainingSystem>(
  "TrainingSystem",
  TrainingSystemSchema
);
