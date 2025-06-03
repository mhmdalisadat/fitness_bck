import mongoose, { Schema, Document } from "mongoose";
import {
  MUSCLE_GROUPS,
  DIFFICULTY_LEVELS,
  EQUIPMENT_TYPES,
  MOVEMENT_TYPES,
  SetType,
  SET_TYPES,
} from "../constants/enums";


const MovementSchema = new Schema(
  {
    // Core Information
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
    movement_type: {
      type: String,
      enum: MOVEMENT_TYPES,
      required: [true, "نوع حرکت الزامی است"],
    },
    movement_muscle_group: {
      type: String,
      enum: MUSCLE_GROUPS,
      required: [true, "گروه عضلانی الزامی است"],
    },
    movement_difficulty: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      required: [true, "سطح سختی الزامی است"],
    },

    // Media
    movement_video_url: {
      type: String,
      trim: true,
    },
    movement_image_url: {
      type: String,
      trim: true,
    },

    // Workout Context
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

    // Equipment and Requirements
    movement_equipment: [
      {
        type: String,
        enum: EQUIPMENT_TYPES,
        required: [true, "تجهیزات مورد نیاز الزامی است"],
      },
    ],
    movement_equipment_requirements: {
      minimum: [
        {
          type: String,
          enum: EQUIPMENT_TYPES,
          required: [true, "حداقل تجهیزات الزامی است"],
        },
      ],
      optional: [
        {
          type: String,
          enum: EQUIPMENT_TYPES,
        },
      ],
    },
    movement_space_requirements: {
      type: String,
      enum: ["small", "medium", "large"],
      required: [true, "نیاز فضایی حرکت الزامی است"],
    },

    // Set Configuration
    movement_set_types: [
      {
        type: String,
        enum: SET_TYPES,
        required: [true, "نوع ست الزامی است"],
      },
    ],
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

    // Technique and Execution
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

    // Muscle Activation
    movement_muscle_activation: {
      primary_muscles: [
        {
          muscle: {
            type: String,
            required: [true, "عضله اصلی الزامی است"],
            enum: MUSCLE_GROUPS,
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
            enum: MUSCLE_GROUPS,
          },
          activation_level: {
            type: String,
            enum: ["high", "medium", "low"],
            required: [true, "سطح فعال‌سازی عضله الزامی است"],
          },
        },
      ],
    },

    // Progression and Variations
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
          enum: DIFFICULTY_LEVELS,
          required: [true, "سطح سختی تغییر حرکت الزامی است"],
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

    // Safety and Considerations
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

    // Metrics and Performance
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

    // Status
    movement_is_active: {
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


MovementSchema.index({ movement_name: 1 });
MovementSchema.index({ movement_name_en: 1 });
MovementSchema.index({ movement_type: 1 });
MovementSchema.index({ movement_muscle_group: 1 });
MovementSchema.index({ movement_equipment: 1 });
MovementSchema.index({ movement_difficulty: 1 });
MovementSchema.index({ movement_workout_id: 1 });
MovementSchema.index({ movement_day_id: 1 });
MovementSchema.index({ movement_is_active: 1 });

// Virtuals
MovementSchema.virtual("workout", {
  ref: "Workout",
  localField: "movement_workout_id",
  foreignField: "_id",
  justOne: true,
});

MovementSchema.virtual("day", {
  ref: "Day",
  localField: "movement_day_id",
  foreignField: "_id",
  justOne: true,
});

// Methods
MovementSchema.methods.getTotalTime = function () {
  const timePerSet = this.movement_set_config.reps * 5; // Assuming 5 seconds per rep
  return (
    (timePerSet + this.movement_set_config.rest_time) *
    this.movement_set_config.sets
  );
};

// Types
export interface IMovement extends Document {
  // Core Information
  movement_name: string;
  movement_name_en: string;
  movement_type: (typeof MOVEMENT_TYPES)[number];
  movement_muscle_group: (typeof MUSCLE_GROUPS)[number];
  movement_difficulty: (typeof DIFFICULTY_LEVELS)[number];
  movement_description: string;

  // Media
  movement_video_url?: string;
  movement_image_url?: string;

  // Workout Context
  movement_workout_id: mongoose.Types.ObjectId;
  movement_day_id: mongoose.Types.ObjectId;
  movement_order: number;

  // Equipment and Requirements
  movement_equipment: (typeof EQUIPMENT_TYPES)[number][];
  movement_equipment_requirements: {
    minimum: (typeof EQUIPMENT_TYPES)[number][];
    optional: (typeof EQUIPMENT_TYPES)[number][];
  };
  movement_space_requirements: "small" | "medium" | "large";

  // Set Configuration
  movement_set_types: SetType[];
  movement_set_config: {
    sets: number;
    reps: number;
    rest_time: number;
    rest_time_unit: "seconds" | "minutes";
  };

  // Status
  movement_is_active: boolean;

  // Virtuals
  workout: any;
  day: any;

  // Methods
  getTotalTime(): number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export const Movement = mongoose.model<IMovement>("Movement", MovementSchema);
