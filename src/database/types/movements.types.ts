import { MUSCLE_GROUPS, DIFFICULTY_LEVELS, EQUIPMENT_TYPES, MOVEMENT_TYPES, SET_TYPES } from '../../constants/enums';

export interface Movement {
  id: number;
  name: string;
  nameEn?: string;
  description: string;
  type: (typeof MOVEMENT_TYPES)[number];
  muscleGroup: (typeof MUSCLE_GROUPS)[number];
  difficulty: (typeof DIFFICULTY_LEVELS)[number];
  videoUrl?: string;
  imageUrl?: string;
  workoutId: number;
  dayId: number;
  order: number;
  equipment: (typeof EQUIPMENT_TYPES)[number][];
  setTypes: Array<{
    type: (typeof SET_TYPES)[number];
    config: any;
  }>;
  sets: number;
  reps: number;
  restTime: number;
  tempo: string;
  weight: number;
  weightUnit: 'kg' | 'lb';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMovementInput {
  name: string;
  nameEn?: string;
  description: string;
  type: (typeof MOVEMENT_TYPES)[number];
  muscleGroup: (typeof MUSCLE_GROUPS)[number];
  difficulty: (typeof DIFFICULTY_LEVELS)[number];
  videoUrl?: string;
  imageUrl?: string;
  workoutId: number;
  dayId: number;
  order: number;
  equipment: (typeof EQUIPMENT_TYPES)[number][];
  setTypes: Array<{
    type: (typeof SET_TYPES)[number];
    config: any;
  }>;
  sets: number;
  reps: number;
  restTime: number;
  tempo?: string;
  weight: number;
  weightUnit?: 'kg' | 'lb';
  isActive?: boolean;
}

export interface UpdateMovementInput {
  name?: string;
  nameEn?: string;
  description?: string;
  type?: (typeof MOVEMENT_TYPES)[number];
  muscleGroup?: (typeof MUSCLE_GROUPS)[number];
  difficulty?: (typeof DIFFICULTY_LEVELS)[number];
  videoUrl?: string;
  imageUrl?: string;
  workoutId?: number;
  dayId?: number;
  order?: number;
  equipment?: (typeof EQUIPMENT_TYPES)[number][];
  setTypes?: Array<{
    type: (typeof SET_TYPES)[number];
    config: any;
  }>;
  sets?: number;
  reps?: number;
  restTime?: number;
  tempo?: string;
  weight?: number;
  weightUnit?: 'kg' | 'lb';
  isActive?: boolean;
} 