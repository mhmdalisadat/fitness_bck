import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

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
      index: true,
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
    workout_weeks: {
      type: Number,
      required: [true, "تعداد هفته‌های برنامه تمرینی الزامی است"],
      min: [1, "حداقل تعداد هفته‌های برنامه باید ۱ باشد"],
      max: [52, "حداکثر تعداد هفته‌های برنامه باید ۵۲ باشد"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// تعریف فیلد مجازی برای روزها
WorkoutSchema.virtual("days", {
  ref: "Day",
  localField: "_id",
  foreignField: "day_workout_id",
});

// تعریف اینترفیس برای تایپ‌اسکریپت
export interface IWorkout extends Document {
  workout_id: string;
  workout_name: string;
  workout_description: string;
  workout_days_per_week: number;
  workout_weeks: number;
  creator: any; // سازنده برنامه
  days: any[]; // روزهای برنامه
  createdAt: Date;
  updatedAt: Date;
}

export const Workout = mongoose.model<IWorkout>("Workout", WorkoutSchema);
