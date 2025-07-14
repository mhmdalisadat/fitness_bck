export interface IWorkout {
  id: number;
  workoutId: string;
  workoutName: string;
  workoutDescription: string;
  workoutDaysPerWeek: number;
  workoutWeeks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateWorkoutInput {
  workoutName: string;
  workoutDescription: string;
  workoutDaysPerWeek: number;
  workoutWeeks: number;
}

export interface IUpdateWorkoutInput {
  workoutName?: string;
  workoutDescription?: string;
  workoutDaysPerWeek?: number;
  workoutWeeks?: number;
} 