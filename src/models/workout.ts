import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import {
  DIFFICULTY_LEVELS,
  MUSCLE_GROUPS,
  EQUIPMENT_TYPES,
} from "../constants/enums";

const WorkoutSchema = new Schema(
  {
    workout_id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
      required: true,
    },
    workout_name: {
      type: String,
      required: [true, "نام برنامه تمرینی الزامی است"],
      trim: true,
      unique: true,
    },
    workout_description: {
      type: String,
      required: [true, "توضیحات برنامه تمرینی الزامی است"],
      trim: true,
    },
    workout_days_per_week: {
      type: Number,
      required: [true, "تعداد روزهای تمرین در هفته الزامی است"],
      min: [1, "حداقل تعداد روزهای تمرین در هفته باید ۱ باشد"],
      max: [7, "حداکثر تعداد روزهای تمرین در هفته باید ۷ باشد"],
    },
    workout_difficulty: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      required: [true, "سطح دشواری برنامه تمرینی الزامی است"],
    },
    workout_target_muscles: [
      {
        type: String,
        enum: MUSCLE_GROUPS,
        required: [true, "گروه عضلانی هدف الزامی است"],
      },
    ],
    workout_duration: {
      type: Number,
      required: [true, "مدت زمان برنامه تمرینی الزامی است"],
      min: [1, "حداقل مدت زمان برنامه تمرینی باید ۱ هفته باشد"],
      max: [52, "حداکثر مدت زمان برنامه تمرینی باید ۵۲ هفته باشد"],
    },
    workout_duration_unit: {
      type: String,
      enum: ["day", "week", "month"],
      required: [true, "واحد مدت زمان برنامه تمرینی الزامی است"],
    },
    workout_equipment: [
      {
        type: String,
        enum: EQUIPMENT_TYPES,
        required: [true, "تجهیزات مورد نیاز الزامی است"],
      },
    ],
    workout_is_public: {
      type: Boolean,
      default: false,
    },
    workout_is_active: {
      type: Boolean,
      default: true,
    },
    workout_rating: {
      type: Number,
      default: 0,
      min: [0, "حداقل امتیاز باید ۰ باشد"],
      max: [5, "حداکثر امتیاز باید ۵ باشد"],
    },
    workout_number_of_ratings: {
      type: Number,
      default: 0,
      min: [0, "تعداد امتیازدهی نمی‌تواند منفی باشد"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ایجاد ایندکس برای جستجوی سریع‌تر
WorkoutSchema.index({ workout_difficulty: 1 });
WorkoutSchema.index({ workout_target_muscles: 1 });
WorkoutSchema.index({ workout_is_active: 1 });

// متد برای محاسبه میانگین امتیاز
WorkoutSchema.methods.calculateAverageRating = function () {
  if (this.workout_number_of_ratings === 0) return 0;
  return this.workout_rating / this.workout_number_of_ratings;
};

// متد برای اضافه کردن امتیاز جدید
WorkoutSchema.methods.addRating = function (rating: number) {
  this.workout_rating += rating;
  this.workout_number_of_ratings += 1;
  return this.save();
};

// تعریف اینترفیس برای تایپ‌اسکریپت
export interface IWorkout extends Document {
  workout_id: string;
  workout_name: string;
  workout_description: string;
  workout_days_per_week: number;
  workout_difficulty: (typeof DIFFICULTY_LEVELS)[number];
  workout_target_muscles: (typeof MUSCLE_GROUPS)[number][];
  workout_duration: number;
  workout_duration_unit: "day" | "week" | "month";
  workout_equipment: (typeof EQUIPMENT_TYPES)[number][];
  workout_is_public: boolean;
  workout_is_active: boolean;
  workout_rating: number;
  workout_number_of_ratings: number;
  creator: any; // سازنده برنامه
  days: any[]; // روزهای برنامه
  calculateAverageRating(): number;
  addRating(rating: number): Promise<IWorkout>;
  createdAt: Date;
  updatedAt: Date;
}

export const Workout = mongoose.model<IWorkout>("Workout", WorkoutSchema);
