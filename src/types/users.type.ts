import type { TRAINING_EXPERIENCE_LEVELS, TRAINING_GOALS, MEDICAL_CONDITIONS, INJURIES } from '../constants/enums';

export interface IUser {
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

export interface ICreateUserInput {
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

export interface IUpdateUserInput {
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

export interface IUserFilters {
  isActive?: boolean;
  trainingExperience?: string;
  ageMin?: number;
  ageMax?: number;
  search?: string;
}

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}