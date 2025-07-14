
export const MUSCLE_GROUPS = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "legs",
  "abs",
  "full_body",
  "rest",
] as const;


export const DIFFICULTY_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
  "professional",
] as const;


export const EQUIPMENT_TYPES = [
  "none",
  "dumbbell",
  "barbell",
  "kettlebell",
  "resistance_band",
  "machine",
  "cable",
  "bodyweight",
  "bench",
  "pull_up_bar",
  "dip_bars",
] as const;


export const TRAINING_GOALS = [
  "weight_loss",
  "muscle_gain",
  "strength",
  "endurance",
  "flexibility",
  "general_fitness",
] as const;


export const MOVEMENT_TYPES = [
  "compound",
  "isolation",
  "cardio",
  "stretch",
  "plyometric",
] as const;

export const WEEK_DAYS = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;


export const TRAINING_TIMES = [
  "morning",
  "afternoon",
  "evening",
  "night",
] as const;

export const TRAINING_EXPERIENCE_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export const MEDICAL_CONDITIONS = [
  "heart_disease",
  "diabetes",
  "hypertension",
  "asthma",
  "arthritis",
  "none",
] as const;

export const INJURIES = [
  "knee",
  "shoulder",
  "back",
  "wrist",
  "ankle",
  "none",
] as const;

export type SetType =
  | "straight"
  | "superset" 
  | "triset" 
  | "giant" 
  | "drop" 
  | "restPause" 
  | "pyramid" // Pyramid Set
  | "fst7" // FST-7
  | "cluster" // Cluster Sets
  | "circuit" // Circuit Training
  | "hiit" // HIIT
  | "preExhaust" // Pre-Exhaust
  | "postExhaust" // Post-Exhaust
  | "tut" // Time Under Tension
  | "powerbuilding" // Powerbuilding
  | "mindMuscle"; // Mind-Muscle Connection

export const SET_TYPES: SetType[] = [
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
];
