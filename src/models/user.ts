import mongoose, { Schema, Document } from "mongoose";
import {
  DIFFICULTY_LEVELS,
  TRAINING_GOALS,
  WEEK_DAYS,
  TRAINING_TIMES,
} from "../constants/enums";

const UserSchema = new Schema(
  {
    phoneNumber: {
      type: String,
      required: [true, "شماره موبایل الزامی است"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "نام کاربر الزامی است"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "سن کاربر الزامی است"],
      min: [12, "حداقل سن باید ۱۲ سال باشد"],
      max: [100, "حداکثر سن باید ۱۰۰ سال باشد"],
    },
    height: {
      type: Number,
      required: [true, "قد کاربر الزامی است"],
      min: [100, "حداقل قد باید ۱۰۰ سانتی‌متر باشد"],
      max: [250, "حداکثر قد باید ۲۵۰ سانتی‌متر باشد"],
    },
    weight: {
      type: Number,
      required: [true, "وزن کاربر الزامی است"],
      min: [30, "حداقل وزن باید ۳۰ کیلوگرم باشد"],
      max: [300, "حداکثر وزن باید ۳۰۰ کیلوگرم باشد"],
    },
    trainingExperience: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      required: [true, "سطح تجربه تمرینی الزامی است"],
    },
    trainingGoals: [
      {
        type: String,
        enum: TRAINING_GOALS,
        required: [true, "هدف تمرینی الزامی است"],
      },
    ],
    medicalConditions: [
      {
        type: String,
        trim: true,
      },
    ],
    injuries: [
      {
        type: String,
        trim: true,
      },
    ],
    preferredTrainingDays: [
      {
        type: String,
        enum: WEEK_DAYS,
        required: [true, "روزهای تمرین مورد نظر الزامی است"],
      },
    ],
    preferredTrainingTime: {
      type: String,
      enum: TRAINING_TIMES,
      required: [true, "زمان تمرین مورد نظر الزامی است"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ایجاد ایندکس برای جستجوی سریع‌تر
UserSchema.index({ isActive: 1 });

// تعریف اینترفیس برای تایپ‌اسکریپت
export interface IUser extends Document {
  phoneNumber: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  trainingExperience: (typeof DIFFICULTY_LEVELS)[number];
  trainingGoals: (typeof TRAINING_GOALS)[number][];
  medicalConditions: string[];
  injuries: string[];
  preferredTrainingDays: (typeof WEEK_DAYS)[number][];
  preferredTrainingTime: (typeof TRAINING_TIMES)[number];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const User = mongoose.model<IUser>("User", UserSchema);
