import mongoose, { Schema, Document } from "mongoose";
import {
  MUSCLE_GROUPS,
  DIFFICULTY_LEVELS,
  EQUIPMENT_TYPES,
  MOVEMENT_TYPES,
} from "../constants/enums";

const MovementSchema = new Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "نام حرکت الزامی است"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "توضیحات حرکت الزامی است"],
      trim: true,
    },
    type: {
      type: String,
      enum: MOVEMENT_TYPES,
      required: [true, "نوع حرکت الزامی است"],
    },
    muscle_group: {
      type: String,
      enum: MUSCLE_GROUPS,
      required: [true, "گروه عضلانی الزامی است"],
    },
    difficulty: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      required: [true, "سطح سختی الزامی است"],
    },
    workout_id: {
      type: Schema.Types.ObjectId,
      ref: "Workout",
      required: [true, "شناسه برنامه تمرینی الزامی است"],
    },
    day_id: {
      type: Schema.Types.ObjectId,
      ref: "Day",
      required: [true, "شناسه روز تمرین الزامی است"],
    },
    equipment: [
      {
        type: String,
        enum: EQUIPMENT_TYPES,
        required: [true, "تجهیزات مورد نیاز الزامی است"],
      },
    ],
    set_types: [
      {
        type: {
          type: String,
          enum: [
            "straight",
            "superset",
            "drop",
            "giant",
            "rest_pause",
            "pyramid",
            "cluster",
            "circuit",
          ],
          required: [true, "نوع ست الزامی است"],
        },
        config: {
          type: Schema.Types.Mixed,
          required: [true, "تنظیمات ست الزامی است"],
        },
      },
    ],
    sets: {
      type: Number,
      required: [true, "تعداد ست الزامی است"],
      min: [1, "تعداد ست باید حداقل 1 باشد"],
      max: [20, "تعداد ست نمی‌تواند بیشتر از 20 باشد"],
    },
    reps: {
      type: Number,
      required: [true, "تعداد تکرار الزامی است"],
      min: [1, "تعداد تکرار باید حداقل 1 باشد"],
      max: [100, "تعداد تکرار نمی‌تواند بیشتر از 100 باشد"],
    },
    rest_time: {
      type: Number,
      required: [true, "زمان استراحت الزامی است"],
      min: [0, "زمان استراحت نمی‌تواند منفی باشد"],
      max: [300, "زمان استراحت نمی‌تواند بیشتر از 300 ثانیه باشد"],
    },
    tempo: {
      type: String,
      pattern: /^\d{1,2}-\d{1,2}-\d{1,2}-\d{1,2}$/,
      required: [true, "تمپوی حرکت الزامی است"],
      default: "3-1-1-1",
    },
    weight: {
      type: Number,
      required: [true, "وزنه الزامی است"],
      min: [0, "وزنه نمی‌تواند منفی باشد"],
    },
    is_active: {
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

MovementSchema.index({ name: 1 });
MovementSchema.index({ name_en: 1 });
MovementSchema.index({ type: 1 });
MovementSchema.index({ muscle_group: 1 });
MovementSchema.index({ workout_id: 1 });
MovementSchema.index({ day_id: 1 });
MovementSchema.index({ is_active: 1 });

MovementSchema.virtual("workout", {
  ref: "Workout",
  localField: "workout_id",
  foreignField: "_id",
  justOne: true,
});

MovementSchema.virtual("day", {
  ref: "Day",
  localField: "day_id",
  foreignField: "_id",
  justOne: true,
});

MovementSchema.methods.getTotalTime = function () {
  const timePerSet = this.reps * 5;
  return (timePerSet + this.rest_time) * this.sets;
};

export interface IMovement extends Document {
  name: string;
  name_en: string;
  type: (typeof MOVEMENT_TYPES)[number];
  muscle_group: (typeof MUSCLE_GROUPS)[number];
  difficulty: (typeof DIFFICULTY_LEVELS)[number];
  description: string;

  video_url?: string;
  image_url?: string;

  workout_id: mongoose.Types.ObjectId;
  day_id: mongoose.Types.ObjectId;
  order: number;

  equipment: (typeof EQUIPMENT_TYPES)[number][];

  set_types: Array<{
    type:
      | "straight"
      | "superset"
      | "drop"
      | "giant"
      | "rest_pause"
      | "pyramid"
      | "cluster"
      | "circuit";
    config: any;
  }>;
  sets: number;
  reps: number;
  rest_time: number;
  tempo: string;
  weight: number;
  weight_unit: "kg" | "lb";

  is_active: boolean;

  workout: any;
  day: any;

  getTotalTime(): number;

  createdAt: Date;
  updatedAt: Date;
}

export const Movement = mongoose.model<IMovement>("Movement", MovementSchema);
