import type {
  TRAINING_EXPERIENCE_LEVELS,
  MUSCLE_GROUPS,
  MOVEMENT_TYPES,
  EQUIPMENT_TYPES,
  DIFFICULTY_LEVELS,
  SetType,
} from "../constants/enums";

export interface IWorkoutData {
  workout_name: string;
  workout_description: string;
  workout_days_per_week: number;
  workout_weeks: number;
  user?: IUserData;
  days?: IDayData[];
  movements?: IMovementData[];
  [key: string]: any;
}

export interface IUserData {
  phoneNumber: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  trainingExperience: (typeof TRAINING_EXPERIENCE_LEVELS)[number];
  trainingGoals: string[];
  medicalConditions: string[];
  injuries: string[];
  [key: string]: any;
}

export interface IDayData {
  day_number: number;
  day_muscle_groups: (typeof MUSCLE_GROUPS)[number][];
  movements?: IMovementData[];
}

export interface IMovementData {
  day_number: number;
  movement_name: string;
  movement_name_en: string;
  movement_description: string;
  movement_muscle_group: (typeof MUSCLE_GROUPS)[number];
  movement_type: (typeof MOVEMENT_TYPES)[number];
  movement_equipment: (typeof EQUIPMENT_TYPES)[number][];
  movement_difficulty: (typeof DIFFICULTY_LEVELS)[number];
  movement_sets: number;
  movement_reps: number;
  movement_rest_time: number;
  movement_notes?: string;
  movement_video_url?: string;
  movement_image_url?: string;
  movement_set_types: SetType[];
  movement_set_config?: {
    sets: number;
    reps: number;
    rest_time: number;
    rest_time_unit: "seconds" | "minutes";
  };
}
