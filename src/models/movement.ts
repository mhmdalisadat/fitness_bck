import mongoose, { Schema, Document } from "mongoose";
import {
  MUSCLE_GROUPS,
  DIFFICULTY_LEVELS,
  EQUIPMENT_TYPES,
  MOVEMENT_TYPES,
} from "../constants/enums";

// تعریف مدل حرکت تمرینی
const MovementSchema = new Schema(
  {
    movement_name: {
      type: String,
      required: [true, "نام حرکت الزامی است"],
      trim: true,
    },
    movement_name_en: {
      type: String,
      required: [true, "نام انگلیسی حرکت الزامی است"],
      trim: true,
    },
    movement_description: {
      type: String,
      required: [true, "توضیحات حرکت الزامی است"],
      trim: true,
    },
    movement_muscle_group: {
      type: String,
      enum: MUSCLE_GROUPS,
      required: [true, "گروه عضلانی الزامی است"],
    },

    movement_type: {
      type: String,
      enum: MOVEMENT_TYPES,
      required: [true, "نوع حرکت الزامی است"],
    },

    movement_equipment: [
      {
        type: String,
        enum: EQUIPMENT_TYPES,
        required: [true, "تجهیزات مورد نیاز الزامی است"],
      },
    ],

    movement_set_types: [
      {
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
      },
    ],
    movement_set_types_text: {
      straight: { type: String, default: "ست معمولی" },
      superset: { type: String, default: "سوپرست" },
      triset: { type: String, default: "تری‌ست" },
      giant: { type: String, default: "جاینت ست" },
      drop: { type: String, default: "دراپ‌ست" },
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
    movement_set_types_description: {
      straight: {
        type: String,
        default: "اجرای یک تمرین خاص در چند ست با تعداد تکرار مشخص",
      },
      superset: {
        type: String,
        default: "اجرای دو تمرین پشت سر هم بدون استراحت",
      },
      triset: { type: String, default: "انجام سه تمرین متوالی بدون استراحت" },
      giant: {
        type: String,
        default: "اجرای 4 تمرین یا بیشتر برای یک گروه عضلانی",
      },
      drop: {
        type: String,
        default: "شروع با وزنه سنگین و کاهش وزنه بعد از ناتوانی",
      },
      restPause: {
        type: String,
        default: "انجام تا ناتوانی، استراحت کوتاه، و ادامه",
      },
      pyramid: {
        type: String,
        default: "افزایش یا کاهش وزنه و تکرارها در هر ست",
      },
      fst7: { type: String, default: "7 ست با استراحت کوتاه برای کشش فاشیا" },
      cluster: { type: String, default: "شکستن یک ست سنگین به چند مینی‌ست" },
      circuit: {
        type: String,
        default: "زنجیره‌ای از تمرینات مختلف با حداقل استراحت",
      },
      hiit: { type: String, default: "تناوب بین فاز شدید و فاز استراحت" },
      preExhaust: { type: String, default: "تمرین ایزوله قبل از تمرین ترکیبی" },
      postExhaust: {
        type: String,
        default: "تمرین ترکیبی قبل از تمرین ایزوله",
      },
      tut: { type: String, default: "افزایش مدت زمانی که عضله تحت فشار است" },
      powerbuilding: { type: String, default: "ترکیب قدرت و تمرینات حجمی" },
      mindMuscle: { type: String, default: "تمرکز بر ارتباط ذهن و عضله" },
    },
    movement_difficulty: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      required: [true, "سطح سختی الزامی است"],
    },

    movement_video_url: {
      type: String,
      trim: true,
    },
    movement_image_url: {
      type: String,
      trim: true,
    },
    movement_workout_id: {
      type: Schema.Types.ObjectId,
      ref: "Workout",
      required: [true, "شناسه برنامه تمرینی الزامی است"],
    },
    movement_day_id: {
      type: Schema.Types.ObjectId,
      ref: "Day",
      required: [true, "شناسه روز تمرین الزامی است"],
    },
    movement_order: {
      type: Number,
      required: [true, "ترتیب حرکت الزامی است"],
      min: [1, "ترتیب حرکت باید حداقل 1 باشد"],
    },
    movement_sets: {
      type: Number,
      required: [true, "تعداد ست الزامی است"],
      min: [1, "تعداد ست باید حداقل 1 باشد"],
    },
    movement_reps: {
      type: Number,
      required: [true, "تعداد تکرار الزامی است"],
      min: [1, "تعداد تکرار باید حداقل 1 باشد"],
    },
    movement_rest: {
      type: Number,
      required: [true, "زمان استراحت الزامی است"],
      min: [0, "زمان استراحت نمی‌تواند منفی باشد"],
    },
    movement_notes: {
      type: String,
      trim: true,
    },
    movement_is_active: {
      type: Boolean,
      default: true,
    },
    movement_set_config: {
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
      rest_time_unit: {
        type: String,
        enum: ["seconds", "minutes"],
        default: "seconds",
      },
    },
    movement_set_specific_config: {
      straight: {
        weight: {
          type: Number,
          min: [0, "وزنه نمی‌تواند منفی باشد"],
        },
        weight_unit: {
          type: String,
          enum: ["kg", "lb"],
          default: "kg",
        },
      },
      superset: {
        related_movements: [
          {
            type: Schema.Types.ObjectId,
            ref: "Movement",
          },
        ],
        rest_between_movements: {
          type: Number,
          default: 0,
          min: [0, "زمان استراحت نمی‌تواند منفی باشد"],
        },
      },
      triset: {
        related_movements: [
          {
            type: Schema.Types.ObjectId,
            ref: "Movement",
          },
        ],
        rest_between_movements: {
          type: Number,
          default: 0,
          min: [0, "زمان استراحت نمی‌تواند منفی باشد"],
        },
      },
      giant: {
        related_movements: [
          {
            type: Schema.Types.ObjectId,
            ref: "Movement",
          },
        ],
        rest_between_movements: {
          type: Number,
          default: 0,
          min: [0, "زمان استراحت نمی‌تواند منفی باشد"],
        },
      },
      drop: {
        initial_weight: {
          type: Number,
          required: [true, "وزنه اولیه الزامی است"],
          min: [0, "وزنه نمی‌تواند منفی باشد"],
        },
        secondary_weight: {
          type: Number,
          required: [true, "وزنه ثانویه الزامی است"],
          min: [0, "وزنه نمی‌تواند منفی باشد"],
        },
        weight_unit: {
          type: String,
          enum: ["kg", "lb"],
          default: "kg",
        },
        rest_between_drops: {
          type: Number,
          default: 0,
          min: [0, "زمان استراحت نمی‌تواند منفی باشد"],
        },
      },
      restPause: {
        initial_reps: {
          type: Number,
          required: [true, "تعداد تکرار اولیه الزامی است"],
          min: [1, "تعداد تکرار باید حداقل 1 باشد"],
        },
        rest_duration: {
          type: Number,
          required: [true, "مدت زمان استراحت الزامی است"],
          min: [0, "زمان استراحت نمی‌تواند منفی باشد"],
        },
        additional_reps: {
          type: Number,
          required: [true, "تعداد تکرار اضافی الزامی است"],
          min: [1, "تعداد تکرار باید حداقل 1 باشد"],
        },
      },
      pyramid: {
        weight_increase: {
          type: Number,
          required: [true, "افزایش وزنه الزامی است"],
          min: [0, "افزایش وزنه نمی‌تواند منفی باشد"],
        },
        rep_decrease: {
          type: Number,
          required: [true, "کاهش تکرار الزامی است"],
          min: [0, "کاهش تکرار نمی‌تواند منفی باشد"],
        },
      },
      fst7: {
        rest_between_sets: {
          type: Number,
          required: [true, "زمان استراحت بین ست‌ها الزامی است"],
          min: [0, "زمان استراحت نمی‌تواند منفی باشد"],
        },
      },
      cluster: {
        reps_per_cluster: {
          type: Number,
          required: [true, "تعداد تکرار در هر خوشه الزامی است"],
          min: [1, "تعداد تکرار باید حداقل 1 باشد"],
        },
        rest_between_clusters: {
          type: Number,
          required: [true, "زمان استراحت بین خوشه‌ها الزامی است"],
          min: [0, "زمان استراحت نمی‌تواند منفی باشد"],
        },
      },
      circuit: {
        related_movements: [
          {
            type: Schema.Types.ObjectId,
            ref: "Movement",
          },
        ],
        rest_between_circuits: {
          type: Number,
          required: [true, "زمان استراحت بین مدارها الزامی است"],
          min: [0, "زمان استراحت نمی‌تواند منفی باشد"],
        },
      },
      hiit: {
        work_duration: {
          type: Number,
          required: [true, "مدت زمان کار الزامی است"],
          min: [0, "مدت زمان کار نمی‌تواند منفی باشد"],
        },
        rest_duration: {
          type: Number,
          required: [true, "مدت زمان استراحت الزامی است"],
          min: [0, "مدت زمان استراحت نمی‌تواند منفی باشد"],
        },
      },
      preExhaust: {
        isolation_movement: {
          type: Schema.Types.ObjectId,
          ref: "Movement",
          required: [true, "حرکت ایزوله الزامی است"],
        },
        compound_movement: {
          type: Schema.Types.ObjectId,
          ref: "Movement",
          required: [true, "حرکت ترکیبی الزامی است"],
        },
      },
      postExhaust: {
        compound_movement: {
          type: Schema.Types.ObjectId,
          ref: "Movement",
          required: [true, "حرکت ترکیبی الزامی است"],
        },
        isolation_movement: {
          type: Schema.Types.ObjectId,
          ref: "Movement",
          required: [true, "حرکت ایزوله الزامی است"],
        },
      },
      tut: {
        tempo: {
          type: String,
          required: [true, "تمپوی حرکت الزامی است"],
          pattern: /^\d{1,2}-\d{1,2}-\d{1,2}-\d{1,2}$/,
        },
      },
      powerbuilding: {
        strength_sets: {
          type: Number,
          required: [true, "تعداد ست‌های قدرتی الزامی است"],
          min: [1, "تعداد ست باید حداقل 1 باشد"],
        },
        hypertrophy_sets: {
          type: Number,
          required: [true, "تعداد ست‌های حجمی الزامی است"],
          min: [1, "تعداد ست باید حداقل 1 باشد"],
        },
      },
      mindMuscle: {
        focus_points: [
          {
            type: String,
            required: [true, "نقاط تمرکز الزامی است"],
          },
        ],
      },
    },
    movement_technique: {
      setup: {
        type: String,
        required: [true, "نحوه آماده‌سازی حرکت الزامی است"],
      },
      execution: {
        type: String,
        required: [true, "نحوه اجرای حرکت الزامی است"],
      },
      breathing: {
        type: String,
        required: [true, "نحوه تنفس در حرکت الزامی است"],
      },
      cues: [
        {
          type: String,
          required: [true, "نکات کلیدی اجرای حرکت الزامی است"],
        },
      ],
    },
    movement_muscle_activation: {
      primary_muscles: [
        {
          muscle: {
            type: String,
            required: [true, "عضله اصلی الزامی است"],
            enum: [
              "pectoralis_major",
              "latissimus_dorsi",
              "deltoids",
              "biceps_brachii",
              "triceps_brachii",
              "quadriceps",
              "hamstrings",
              "gluteus_maximus",
              "rectus_abdominis",
              "obliques",
              "erector_spinae",
              "trapezius",
              "rhomboids",
              "calves",
            ],
          },
          activation_level: {
            type: String,
            enum: ["high", "medium", "low"],
            required: [true, "سطح فعال‌سازی عضله الزامی است"],
          },
        },
      ],
      secondary_muscles: [
        {
          muscle: {
            type: String,
            required: [true, "عضله فرعی الزامی است"],
            enum: [
              "pectoralis_major",
              "latissimus_dorsi",
              "deltoids",
              "biceps_brachii",
              "triceps_brachii",
              "quadriceps",
              "hamstrings",
              "gluteus_maximus",
              "rectus_abdominis",
              "obliques",
              "erector_spinae",
              "trapezius",
              "rhomboids",
              "calves",
            ],
          },
          activation_level: {
            type: String,
            enum: ["high", "medium", "low"],
            required: [true, "سطح فعال‌سازی عضله الزامی است"],
          },
        },
      ],
    },
    movement_variations: [
      {
        name: {
          type: String,
          required: [true, "نام تغییر حرکت الزامی است"],
        },
        description: {
          type: String,
          required: [true, "توضیحات تغییر حرکت الزامی است"],
        },
        difficulty: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "professional"],
          required: [true, "سطح سختی تغییر حرکت الزامی است"],
        },
      },
    ],
    movement_common_mistakes: [
      {
        mistake: {
          type: String,
          required: [true, "اشتباه رایج الزامی است"],
        },
        correction: {
          type: String,
          required: [true, "راه‌حل اصلاح اشتباه الزامی است"],
        },
        impact: {
          type: String,
          required: [true, "تاثیر اشتباه الزامی است"],
        },
      },
    ],
    movement_progression: {
      beginner: {
        type: String,
        required: [true, "پیشرفت برای مبتدیان الزامی است"],
      },
      intermediate: {
        type: String,
        required: [true, "پیشرفت برای متوسط‌ها الزامی است"],
      },
      advanced: {
        type: String,
        required: [true, "پیشرفت برای پیشرفته‌ها الزامی است"],
      },
    },
    movement_regression: {
      type: String,
      required: [true, "رگرسیون حرکت الزامی است"],
    },
    movement_contraindications: [
      {
        condition: {
          type: String,
          required: [true, "شرایط منع حرکت الزامی است"],
        },
        reason: {
          type: String,
          required: [true, "دلیل منع حرکت الزامی است"],
        },
        alternative: {
          type: String,
          required: [true, "حرکت جایگزین الزامی است"],
        },
      },
    ],
    movement_equipment_requirements: {
      minimum: [
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
            "bench",
            "rack",
            "mat",
          ],
          required: [true, "حداقل تجهیزات الزامی است"],
        },
      ],
      optional: [
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
            "bench",
            "rack",
            "mat",
          ],
        },
      ],
    },
    movement_space_requirements: {
      type: String,
      enum: ["small", "medium", "large"],
      required: [true, "نیاز فضایی حرکت الزامی است"],
    },
    movement_skill_requirements: [
      {
        skill: {
          type: String,
          required: [true, "مهارت مورد نیاز الزامی است"],
        },
        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced"],
          required: [true, "سطح مهارت الزامی است"],
        },
      },
    ],
    movement_metrics: {
      rpe_range: {
        min: {
          type: Number,
          min: 1,
          max: 10,
          required: [true, "حداقل RPE الزامی است"],
        },
        max: {
          type: Number,
          min: 1,
          max: 10,
          required: [true, "حداکثر RPE الزامی است"],
        },
      },
      tempo_recommendation: {
        type: String,
        pattern: /^\d{1,2}-\d{1,2}-\d{1,2}-\d{1,2}$/,
        required: [true, "تمپوی پیشنهادی الزامی است"],
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ایجاد ایندکس برای جستجوی سریع‌تر
MovementSchema.index({ movement_name: 1 });
MovementSchema.index({ movement_name_en: 1 });
MovementSchema.index({ movement_type: 1 });
MovementSchema.index({ movement_muscle_group: 1 });
MovementSchema.index({ movement_equipment: 1 });
MovementSchema.index({ movement_difficulty: 1 });
MovementSchema.index({ movement_workout_id: 1 });
MovementSchema.index({ movement_day_id: 1 });
MovementSchema.index({ movement_is_active: 1 });

// اضافه کردن فیلد مجازی برای دسترسی به برنامه تمرینی
MovementSchema.virtual("workout", {
  ref: "Workout",
  localField: "movement_workout_id",
  foreignField: "_id",
  justOne: true,
});

// اضافه کردن فیلد مجازی برای دسترسی به روز تمرین
MovementSchema.virtual("day", {
  ref: "Day",
  localField: "movement_day_id",
  foreignField: "_id",
  justOne: true,
});

// متد برای محاسبه زمان کل حرکت
MovementSchema.methods.getTotalTime = function () {
  const timePerSet = this.movement_reps * 5; // فرض می‌کنیم هر تکرار 5 ثانیه طول می‌کشد
  return (timePerSet + this.movement_rest) * this.movement_sets;
};

export interface IMovement extends Document {
  movement_name: string;
  movement_name_en: string;
  movement_type: (typeof MOVEMENT_TYPES)[number];
  movement_muscle_group: (typeof MUSCLE_GROUPS)[number];
  movement_equipment: (typeof EQUIPMENT_TYPES)[number][];
  movement_difficulty: (typeof DIFFICULTY_LEVELS)[number];
  movement_description: string;
  movement_video_url?: string;
  movement_image_url?: string;
  movement_workout_id: mongoose.Types.ObjectId;
  movement_day_id: mongoose.Types.ObjectId;
  movement_order: number;
  movement_sets: number;
  movement_reps: number;
  movement_rest: number;
  movement_notes?: string;
  movement_is_active: boolean;
  workout: any; // برنامه تمرینی مرتبط
  day: any; // روز تمرین مرتبط
  getTotalTime(): number;
  createdAt: Date;
  updatedAt: Date;
}

export const Movement = mongoose.model<IMovement>("Movement", MovementSchema);
