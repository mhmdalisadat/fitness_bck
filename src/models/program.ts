import mongoose, { Schema, Document } from "mongoose";

// Set Config Schema
const SetConfigSchema = new Schema({
  type: {
    type: String,
    enum: [
      "straight",
      "superset",
      "triset",
      "giant",
      "drop",
      "restPause",
      "pyramid",
      "fst7",
      "cluster",
      "circuit",
      "hiit",
      "preExhaust",
      "postExhaust",
      "tut",
      "powerbuilding",
      "mindMuscle",
    ],
    required: true,
  },
  typeName: {
    straight: { type: String, default: "ست معمولی" },
    superset: { type: String, default: "سوپرست" },
    triset: { type: String, default: "تری‌ست" },
    giant: { type: String, default: "جاینت ست" },
    drop: { type: String, default: "دراپ ست" },
    restPause: { type: String, default: "رست-پاز" },
    pyramid: { type: String, default: "ست هرمی" },
    fst7: { type: String, default: "FST-7" },
    cluster: { type: String, default: "کلسترال" },
    circuit: { type: String, default: "سیرکویت" },
    hiit: { type: String, default: "HIIT" },
    preExhaust: { type: String, default: "پیش خستگی" },
    postExhaust: { type: String, default: "پس خستگی" },
    tut: { type: String, default: "زمان تحت فشار" },
    powerbuilding: { type: String, default: "پاوربیلدینگ" },
    mindMuscle: { type: String, default: "تمرکز ذهن-عضله" },
  },
  targetSets: { type: Number, required: true },
  targetReps: { type: Number, required: true },
  restTime: { type: Number, required: true },
});

// Related Exercise Schema
const RelatedExerciseSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  reps: { type: String, required: true },
  sets: { type: String, required: true },
  restTime: { type: Number, required: true },
});

// Exercise Schema
const ExerciseSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  muscleGroup: { type: String, required: true },
  isCompound: { type: Boolean, required: true },
  isIsolation: { type: Boolean, required: true },
  reps: { type: String, required: true },
  sets: { type: String, required: true },
  setType: { type: String, required: true },
  setConfig: { type: SetConfigSchema, required: true },
  relatedExercises: [RelatedExerciseSchema],
});

// Day Schema
const DaySchema = new Schema({
  day: { type: Number, required: true },
  id: { type: String, required: true },
  targetMuscles: [{ type: String, required: true }],
  exercises: [ExerciseSchema],
});

// Program Schema
const ProgramSchema = new Schema(
  {
    programName: { type: String, required: true },
    daysPerWeek: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
    height: { type: String, required: true },
    weight: { type: String, required: true },
    purpose: {
      type: String,
      enum: ["muscle-gain", "weight-loss", "strength", "endurance"],
      required: true,
    },
    trainingSystem: {
      type: String,
      enum: ["fullbody", "split", "push-pull", "upper-lower"],
      required: true,
    },
    userImage: { type: String, default: "" },
    days: [DaySchema],
  },
  {
    timestamps: true,
  }
);

export interface IProgram extends Document {
  programName: string;
  daysPerWeek: string;
  description: string;
  name: string;
  height: string;
  weight: string;
  purpose: "muscle-gain" | "weight-loss" | "strength" | "endurance";
  trainingSystem: "fullbody" | "split" | "push-pull" | "upper-lower";
  userImage: string;
  days: Array<{
    day: number;
    id: string;
    targetMuscles: string[];
    exercises: Array<{
      id: string;
      name: string;
      description: string;
      muscleGroup: string;
      isCompound: boolean;
      isIsolation: boolean;
      reps: string;
      sets: string;
      setType: string;
      setConfig: {
        type: string;
        typeName: Record<string, string>;
        targetSets: number;
        targetReps: number;
        restTime: number;
      };
      relatedExercises: Array<{
        id: string;
        name: string;
        reps: string;
        sets: string;
        restTime: number;
      }>;
    }>;
  }>;
}

export const Program = mongoose.model<IProgram>("Program", ProgramSchema);
