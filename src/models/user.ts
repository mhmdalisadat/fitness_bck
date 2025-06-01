import mongoose, { Schema, Document } from "mongoose";
import {
  TRAINING_EXPERIENCE_LEVELS,
  TRAINING_GOALS,
  MEDICAL_CONDITIONS,
  INJURIES,
} from "../constants/enums";

const UserSchema = new Schema(
  {
    phoneNumber: {
      type: String,
      required: [true, "شماره تماس الزامی است"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "نام الزامی است"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "سن الزامی است"],
      min: [12, "حداقل سن باید ۱۲ سال باشد"],
      max: [100, "حداکثر سن باید ۱۰۰ سال باشد"],
    },
    height: {
      type: Number,
      required: [true, "قد الزامی است"],
      min: [100, "حداقل قد باید ۱۰۰ سانتی‌متر باشد"],
      max: [250, "حداکثر قد باید ۲۵۰ سانتی‌متر باشد"],
    },
    weight: {
      type: Number,
      required: [true, "وزن الزامی است"],
      min: [30, "حداقل وزن باید ۳۰ کیلوگرم باشد"],
      max: [300, "حداکثر وزن باید ۳۰۰ کیلوگرم باشد"],
    },
    trainingExperience: {
      type: String,
      enum: TRAINING_EXPERIENCE_LEVELS,
      required: [true, "سابقه تمرین الزامی است"],
    },
    trainingGoals: [
      {
        type: String,
        enum: TRAINING_GOALS,
      },
    ],
    medicalConditions: [
      {
        type: String,
        enum: MEDICAL_CONDITIONS,
      },
    ],
    injuries: [
      {
        type: String,
        enum: INJURIES,
      },
    ],
    isActive: {
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
UserSchema.index({ isActive: 1 });

// تعریف اینترفیس برای تایپ‌اسکریپت
export interface IUser extends Document {
  phoneNumber: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  trainingExperience: (typeof TRAINING_EXPERIENCE_LEVELS)[number];
  trainingGoals: (typeof TRAINING_GOALS)[number][];
  medicalConditions: (typeof MEDICAL_CONDITIONS)[number][];
  injuries: (typeof INJURIES)[number][];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const User = mongoose.model<IUser>("User", UserSchema);
