import { MUSCLE_GROUPS } from '../../constants/enums';

export interface WorkoutDay {
  id: number;
  dayNumber: number;
  dayMuscleGroups: (typeof MUSCLE_GROUPS)[number][];
  dayWorkoutId: number;
  dayMovements: number[];
  dayIsActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWorkoutDayInput {
  dayNumber: number;
  dayMuscleGroups: (typeof MUSCLE_GROUPS)[number][];
  dayWorkoutId: number;
  dayMovements?: number[];
  dayIsActive?: boolean;
}

export interface UpdateWorkoutDayInput {
  dayNumber?: number;
  dayMuscleGroups?: (typeof MUSCLE_GROUPS)[number][];
  dayWorkoutId?: number;
  dayMovements?: number[];
  dayIsActive?: boolean;
}

// Helper functions
export const getMovementCount = (dayMovements: number[]): number => {
  return dayMovements.length;
};

export const getTotalWorkoutTime = (movements: any[]): number => {
  return movements.reduce((total, movement) => {
    const timePerSet = movement.reps * 5; // فرض می‌کنیم هر تکرار 5 ثانیه طول می‌کشد
    const totalTimePerMovement = (timePerSet + movement.restTime) * movement.sets;
    return total + totalTimePerMovement;
  }, 0);
}; 