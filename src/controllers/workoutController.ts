import { Request, Response } from "express";
import { Workout, User, Day, Movement } from "../models";
import mongoose from "mongoose";
import { TRAINING_EXPERIENCE_LEVELS, MUSCLE_GROUPS } from "../constants/enums";

// تایپ‌های مورد نیاز
interface IWorkoutData {
  workout_name: string;
  workout_description: string;
  workout_days_per_week: number;
  workout_weeks: number;
  user?: IUserData;
  days?: IDayData[];
}

interface IUserData {
  phoneNumber: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  trainingExperience: (typeof TRAINING_EXPERIENCE_LEVELS)[number];
  trainingGoals: string[];
  medicalConditions: string[];
  injuries: string[];
}

interface IDayData {
  day_number: number;
  day_muscle_groups: (typeof MUSCLE_GROUPS)[number][];
  movements: IMovementData[];
}

interface IMovementData {
  movement_name: string;
  movement_sets: number;
  movement_reps: number;
  movement_rest_time: number;
}

// تبدیل مقادیر رشته‌ای به عدد
const parseNumericFields = (data: any): any => {
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
};

// تبدیل مقادیر رشته‌ای به عدد برای حرکات
const parseMovementFields = (movement: any): any => ({
  ...movement,
  movement_sets: parseInt(movement.movement_sets),
  movement_reps: parseInt(movement.movement_reps),
  movement_rest_time: parseInt(movement.movement_rest_time),
});

// اعتبارسنجی داده‌های ورودی
const validateWorkoutData = (data: IWorkoutData): string | null => {
  if (!data.workout_name?.trim()) return "نام برنامه تمرینی الزامی است";
  if (!data.workout_description?.trim())
    return "توضیحات برنامه تمرینی الزامی است";
  if (
    !data.workout_days_per_week ||
    data.workout_days_per_week < 1 ||
    data.workout_days_per_week > 7
  )
    return "تعداد روزهای تمرین در هفته باید بین ۱ تا ۷ باشد";
  if (!data.workout_weeks || data.workout_weeks < 1 || data.workout_weeks > 52)
    return "تعداد هفته‌های برنامه باید بین ۱ تا ۵۲ باشد";
  return null;
};

export const handleWorkout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { workoutId } = req.params;
    const data = parseNumericFields(req.body) as IWorkoutData;

    // اگر workoutId وجود داشت، یعنی در حال آپدیت هستیم
    if (workoutId) {
      const workout = await Workout.findOne({ workout_id: workoutId }).populate(
        {
          path: "days",
          populate: {
            path: "day_movements",
            model: "Movement",
          },
        }
      );

      if (!workout) {
        res.status(404).json({
          success: false,
          message: "برنامه تمرینی مورد نظر یافت نشد",
        });
        return;
      }

      // اگر فقط اطلاعات کاربر ارسال شده، فقط کاربر رو آپدیت می‌کنیم
      if (data.user && !data.workout_name) {
        let existingUser = await User.findOne({
          phoneNumber: data.user.phoneNumber,
        });

        if (!existingUser) {
          existingUser = new User(data.user);
        } else {
          Object.assign(existingUser, data.user);
        }

        await existingUser.save();

        res.status(200).json({
          success: true,
          message: "اطلاعات کاربر با موفقیت آپدیت شد",
          data: {
            ...workout.toObject(),
            user: existingUser,
          },
        });
        return;
      }

      // اعتبارسنجی داده‌های workout
      const validationError = validateWorkoutData(data);
      if (validationError) {
        res.status(400).json({
          success: false,
          message: validationError,
        });
        return;
      }

      // آپدیت اطلاعات برنامه
      Object.assign(workout, {
        workout_name: data.workout_name,
        workout_description: data.workout_description,
        workout_days_per_week: data.workout_days_per_week,
        workout_weeks: data.workout_weeks,
      });
      await workout.save();

      // پیدا کردن اطلاعات کاربر
      const user = data.user
        ? await User.findOne({ phoneNumber: data.user.phoneNumber })
        : null;

      res.status(200).json({
        success: true,
        message: "برنامه تمرینی با موفقیت آپدیت شد",
        data: {
          ...workout.toObject(),
          user: user || null,
        },
      });
      return;
    }

    // اعتبارسنجی داده‌های workout جدید
    const validationError = validateWorkoutData(data);
    if (validationError) {
      res.status(400).json({
        success: false,
        message: validationError,
      });
      return;
    }

    // بررسی تکراری نبودن نام برنامه
    const existingWorkout = await Workout.findOne({
      workout_name: {
        $regex: new RegExp(`^${data.workout_name.trim()}$`, "i"),
      },
    });

    if (existingWorkout) {
      res.status(400).json({
        success: false,
        message: "برنامه تمرینی با این نام قبلاً ثبت شده است",
        existing_workout: {
          workout_id: existingWorkout.workout_id,
          workout_name: existingWorkout.workout_name,
        },
      });
      return;
    }

    // ایجاد یا آپدیت کاربر
    let existingUser = null;
    if (data.user) {
      existingUser = await User.findOne({ phoneNumber: data.user.phoneNumber });

      if (!existingUser) {
        existingUser = new User(data.user);
      } else {
        Object.assign(existingUser, data.user);
      }

      await existingUser.save();
    }

    // ایجاد برنامه تمرینی جدید
    const workout = new Workout({
      workout_name: data.workout_name,
      workout_description: data.workout_description,
      workout_days_per_week: data.workout_days_per_week,
      workout_weeks: data.workout_weeks,
      creator: existingUser?._id,
    });

    const savedWorkout = await workout.save();

    // ایجاد روزهای تمرین و حرکات آنها
    if (data.days?.length) {
      for (const dayData of data.days) {
        const day = new Day({
          day_number: dayData.day_number,
          day_muscle_groups: dayData.day_muscle_groups,
          day_workout_id: savedWorkout._id,
          day_movements: [],
          day_is_active: true,
        });

        const savedDay = await day.save();

        if (dayData.movements?.length) {
          const savedMovements = await Promise.all(
            dayData.movements.map(async (movementData) => {
              const movement = new Movement({
                ...parseMovementFields(movementData),
                movement_workout_id: savedWorkout._id,
                movement_day_id: savedDay._id,
                movement_is_active: true,
              });
              return await movement.save();
            })
          );

          savedDay.day_movements = savedMovements.map(
            (m) => m._id as mongoose.Types.ObjectId
          );
          await savedDay.save();
        }
      }
    }

    // دریافت برنامه با روزها و حرکات
    const populatedWorkout = await Workout.findById(savedWorkout._id).populate({
      path: "days",
      populate: {
        path: "day_movements",
        model: "Movement",
      },
    });

    res.status(201).json({
      success: true,
      message: "برنامه تمرینی با موفقیت ایجاد شد",
      data: {
        ...populatedWorkout?.toObject(),
        user: existingUser,
      },
    });
  } catch (error) {
    console.error("Error handling workout:", error);
    res.status(500).json({
      success: false,
      message: "خطا در پردازش درخواست",
      error: error instanceof Error ? error.message : "خطای ناشناخته",
    });
  }
};
