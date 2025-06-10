import { Workout, User, Day, Movement } from "../models";
import {
  IWorkoutData,
  IUserData,
  IDayData,
  IMovementData,
} from "../types/workout";
import { TRAINING_EXPERIENCE_LEVELS, MUSCLE_GROUPS } from "../constants/enums";
import mongoose, { Types } from "mongoose";

export class WorkoutService {
  static async createWorkout(data: IWorkoutData) {
    const existingWorkout = await Workout.findOne({
      workout_name: {
        $regex: new RegExp(`^${data.workout_name.trim()}$`, "i"),
      },
    });

    if (existingWorkout) {
      throw new Error("برنامه تمرینی با این نام قبلاً ثبت شده است");
    }

    let existingUser: any = null;
    if (data.user) {
      existingUser = await User.findOne({ phoneNumber: data.user.phoneNumber });

      if (!existingUser) {
        existingUser = new User(data.user);
      } else {
        Object.assign(existingUser, data.user);
      }

      await existingUser.save();
    }

    const workout = new Workout({
      workout_name: data.workout_name,
      workout_description: data.workout_description,
      workout_days_per_week: data.workout_days_per_week,
      workout_weeks: data.workout_weeks,
      creator: existingUser?._id,
    });

    const savedWorkout = await workout.save();

    if (data.days?.length) {
      await this.createDaysAndMovements(
        savedWorkout._id as Types.ObjectId,
        data.days
      );
    }

    return this.getPopulatedWorkout(
      savedWorkout._id as Types.ObjectId,
      existingUser
    );
  }

  static async updateWorkout(
    workoutId: string,
    data: IWorkoutData,
    isPatch: boolean = false
  ) {
    const workout = await Workout.findOne({ workout_id: workoutId });
    if (!workout) {
      throw new Error("برنامه تمرینی مورد نظر یافت نشد");
    }

    const user = workout.creator ? await User.findById(workout.creator) : null;

    if (isPatch) {
      Object.keys(data).forEach((key) => {
        if (
          key !== "user" &&
          key !== "days" &&
          key !== "movements" &&
          data[key] !== undefined
        ) {
          (workout as any)[key] = data[key as keyof IWorkoutData];
        }
      });
    } else {
      Object.assign(workout, {
        workout_name: data.workout_name,
        workout_description: data.workout_description,
        workout_days_per_week: data.workout_days_per_week,
        workout_weeks: data.workout_weeks,
      });
    }

    if (data.days?.length) {
      await Day.deleteMany({ day_workout_id: workout._id });
      await this.createDaysAndMovements(
        workout._id as Types.ObjectId,
        data.days
      );
    }

    await workout.save();

    const updatedUser = data.user
      ? await User.findOne({ phoneNumber: data.user.phoneNumber })
      : user;

    return this.getPopulatedWorkout(workout._id as Types.ObjectId, updatedUser);
  }

  static async addMovement(
    workoutId: string,
    dayNumber: number,
    movementData: IMovementData
  ) {
    const workout = await Workout.findOne({ workout_id: workoutId });
    if (!workout) {
      throw new Error("برنامه تمرینی مورد نظر یافت نشد");
    }

    let day = await Day.findOne({
      day_workout_id: workout._id,
      day_number: dayNumber,
    });

    if (!day) {
      day = new Day({
        day_number: dayNumber,
        day_muscle_groups: [movementData.movement_muscle_group],
        day_workout_id: workout._id,
        day_movements: [],
        day_is_active: true,
      });
      await day.save();
    }

    const newMovement = new Movement({
      ...movementData,
      movement_workout_id: workout._id,
      movement_day_id: day._id,
      movement_is_active: true,
      movement_order: (day.day_movements?.length || 0) + 1,
      movement_set_config: movementData.movement_set_config || {
        sets: movementData.movement_sets,
        reps: movementData.movement_reps,
        rest_time: movementData.movement_rest_time,
        rest_time_unit: "seconds",
      },
    });

    const savedMovement = await newMovement.save();

    day.day_movements.push(savedMovement._id as mongoose.Types.ObjectId);
    if (!day.day_muscle_groups.includes(movementData.movement_muscle_group)) {
      day.day_muscle_groups.push(movementData.movement_muscle_group);
    }
    await day.save();

    return this.getPopulatedWorkout(workout._id as Types.ObjectId);
  }

  private static async createDaysAndMovements(
    workoutId: Types.ObjectId,
    days: IDayData[]
  ) {
    for (const dayData of days) {
      const day = new Day({
        day_number: dayData.day_number,
        day_muscle_groups: dayData.day_muscle_groups,
        day_workout_id: workoutId,
        day_movements: [],
        day_is_active: true,
      });

      const savedDay = await day.save();

      if (dayData.movements?.length) {
        const savedMovements = await Promise.all(
          dayData.movements.map(
            async (movementData: IMovementData, index: number) => {
              const movement = new Movement({
                ...movementData,
                movement_workout_id: workoutId,
                movement_day_id: savedDay._id,
                movement_is_active: true,
                movement_order: index + 1,
                movement_set_config: movementData.movement_set_config || {
                  sets: movementData.movement_sets,
                  reps: movementData.movement_reps,
                  rest_time: movementData.movement_rest_time,
                  rest_time_unit: "seconds",
                },
              });
              return await movement.save();
            }
          )
        );

        savedDay.day_movements = savedMovements.map(
          (m: any) => m._id as mongoose.Types.ObjectId
        );
        await savedDay.save();
      }
    }
  }

  private static async getPopulatedWorkout(
    workoutId: Types.ObjectId,
    user: any = null
  ) {
    const workout = await Workout.findById(workoutId).populate({
      path: "days",
      populate: {
        path: "day_movements",
        model: "Movement",
      },
    });

    return {
      ...workout?.toObject(),
      user,
    };
  }
}
 