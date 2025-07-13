import { TRAINING_EXPERIENCE_LEVELS, TRAINING_GOALS, MEDICAL_CONDITIONS, INJURIES } from '../constants/enums';

export interface User {
  id: number;
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

export interface CreateUserInput {
  phoneNumber: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  trainingExperience: (typeof TRAINING_EXPERIENCE_LEVELS)[number];
  trainingGoals?: (typeof TRAINING_GOALS)[number][];
  medicalConditions?: (typeof MEDICAL_CONDITIONS)[number][];
  injuries?: (typeof INJURIES)[number][];
  isActive?: boolean;
}

export interface UpdateUserInput {
  phoneNumber?: string;
  name?: string;
  age?: number;
  height?: number;
  weight?: number;
  trainingExperience?: (typeof TRAINING_EXPERIENCE_LEVELS)[number];
  trainingGoals?: (typeof TRAINING_GOALS)[number][];
  medicalConditions?: (typeof MEDICAL_CONDITIONS)[number][];
  injuries?: (typeof INJURIES)[number][];
  isActive?: boolean;
}