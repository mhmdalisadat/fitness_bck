import mongoose, { Schema, Document } from "mongoose";
import { MUSCLE_GROUPS } from "../constants/enums";

// تعریف مدل روز تمرین
const DaySchema = new Schema(
  {
    day_number: {
      type: Number,
      required: [true, "شماره روز الزامی است"],
      min: [1, "شماره روز باید حداقل 1 باشد"],
    },
    day_muscle_groups: [
      {
        type: String,
        enum: MUSCLE_GROUPS,
        required: [true, "گروه عضلانی الزامی است"],
      },
    ],

    day_workout_id: {
      type: Schema.Types.ObjectId,
      ref: "Workout",
      required: [true, "شناسه برنامه تمرینی الزامی است"],
    },
    day_movements: [
      {
        type: Schema.Types.ObjectId,
        ref: "Movement",
      },
    ],
    day_is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ایجاد ایندکس برای جستجوی سریع‌تر
DaySchema.index({ day_workout_id: 1 });
DaySchema.index({ day_number: 1 });
DaySchema.index({ day_muscle_groups: 1 });
DaySchema.index({ day_is_active: 1 });

// اضافه کردن فیلد مجازی برای دسترسی به برنامه تمرینی
DaySchema.virtual("workout", {
  ref: "Workout",
  localField: "day_workout_id",
  foreignField: "_id",
  justOne: true,
});

// اضافه کردن فیلد مجازی برای دسترسی به حرکات
DaySchema.virtual("movements", {
  ref: "Movement",
  localField: "_id",
  foreignField: "movement_day_id",
});

// متد برای محاسبه تعداد حرکات
DaySchema.methods.getMovementCount = function () {
  return this.day_movements.length;
};

// متد برای محاسبه زمان کل تمرین
DaySchema.methods.getTotalWorkoutTime = function () {
  return this.movements.reduce(
    (
      total: number,
      movement: {
        movement_sets: number;
        movement_reps: number;
        movement_rest: number;
      }
    ) => {
      const timePerSet = movement.movement_reps * 5; // فرض می‌کنیم هر تکرار 5 ثانیه طول می‌کشد
      const totalTimePerMovement =
        (timePerSet + movement.movement_rest) * movement.movement_sets;
      return total + totalTimePerMovement;
    },
    0
  );
};

// تعریف اینترفیس برای تایپ‌اسکریپت
export interface IDay extends Document {
  day_number: number;
  day_muscle_groups: (typeof MUSCLE_GROUPS)[number][];
  day_workout_id: mongoose.Types.ObjectId;
  day_movements: mongoose.Types.ObjectId[];
  day_is_active: boolean;
  workout: any; // برنامه تمرینی مرتبط
  movements: any[]; // حرکات مرتبط
  getMovementCount(): number;
  getTotalWorkoutTime(): number;
  createdAt: Date;
  updatedAt: Date;
}

export const Day = mongoose.model<IDay>("Day", DaySchema);
