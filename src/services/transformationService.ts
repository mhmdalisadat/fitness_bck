import { IWorkoutData, IMovementData } from "../types/workout";

export class TransformationService {
  static parseNumericFields(data: any): any {
    const numericFields = [
      "age",
      "height",
      "weight",
      "workout_days_per_week",
      "workout_weeks",
    ];
    const result = { ...data };

    numericFields.forEach((field) => {
      if (result[field]) {
        result[field] = parseInt(result[field]);
      }
    });

    return result;
  }

  static parseMovementFields(movement: any): IMovementData {
    return {
      ...movement,
      movement_sets: parseInt(movement.movement_sets),
      movement_reps: parseInt(movement.movement_reps),
      movement_rest_time: parseInt(movement.movement_rest_time),
    };
  }
}
