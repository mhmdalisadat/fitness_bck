export interface Workout {
  id: number;
  workoutId: string;
  workoutName: string;
  workoutDescription: string;
  workoutDaysPerWeek: number;
  workoutWeeks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWorkoutInput {
  workoutName: string;
  workoutDescription: string;
  workoutDaysPerWeek: number;
  workoutWeeks: number;
}

export interface UpdateWorkoutInput {
  workoutName?: string;
  workoutDescription?: string;
  workoutDaysPerWeek?: number;
  workoutWeeks?: number;
} 