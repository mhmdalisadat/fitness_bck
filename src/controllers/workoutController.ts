import { Request, Response } from "express";
import { Workout } from "../models";
import { User } from "../models";
import { Day } from "../models";
import { Movement } from "../models";
import mongoose from "mongoose";

export const handleWorkout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { workoutId } = req.params;
    const data = req.body;

    // اگر workoutId وجود داشت، یعنی در حال آپدیت هستیم
    if (workoutId) {
      const workout = await Workout.findOne({ workout_id: workoutId });
      if (!workout) {
        res.status(404).json({
          success: false,
          message: "برنامه تمرینی مورد نظر یافت نشد",
        });
        return;
      }

      // آپدیت اطلاعات برنامه
      Object.assign(workout, data);
      await workout.save();

      // پیدا کردن اطلاعات کاربر
      const user = await User.findOne({ phoneNumber: data.user?.phoneNumber });

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

    // ایجاد برنامه تمرینی جدید
    const {
      workout_name,
      workout_description,
      workout_days_per_week,
      workout_difficulty,
      workout_duration,
      workout_duration_unit,
      workout_target_muscles,
      workout_equipment,
      workout_is_public,
      workout_tags,
      user,
      days,
    } = data;

    // بررسی وجود فیلدهای اجباری
    if (
      !workout_name ||
      !workout_description ||
      !workout_days_per_week ||
      !workout_difficulty
    ) {
      res.status(400).json({
        success: false,
        message: "فیلدهای اجباری خالی هستند",
        required_fields: [
          "workout_name",
          "workout_description",
          "workout_days_per_week",
          "workout_difficulty",
        ],
      });
      return;
    }

    // بررسی تکراری نبودن نام برنامه
    const existingWorkout = await Workout.findOne({
      workout_name: { $regex: new RegExp(`^${workout_name}$`, "i") },
    });

    if (existingWorkout) {
      res.status(400).json({
        success: false,
        message: "برنامه تمرینی با این نام قبلاً ثبت شده است",
      });
      return;
    }

    // ایجاد یا آپدیت کاربر
    let existingUser = null;
    if (user) {
      existingUser = await User.findOne({ phoneNumber: user.phoneNumber });
      if (!existingUser) {
        existingUser = new User(user);
        await existingUser.save();
      }
    }

    // ایجاد برنامه تمرینی جدید
    const workout = new Workout({
      workout_name,
      workout_description,
      workout_days_per_week,
      workout_difficulty,
      workout_duration: workout_duration || 1,
      workout_duration_unit: workout_duration_unit || "week",
      workout_target_muscles: workout_target_muscles || [],
      workout_equipment: workout_equipment || [],
      workout_is_public: workout_is_public || false,
      workout_tags: workout_tags || [],
      workout_is_active: true,
      workout_rating: 0,
      workout_number_of_ratings: 0,
    });

    const savedWorkout = await workout.save();

    // ایجاد روزهای تمرین و حرکات آنها
    if (days && Array.isArray(days)) {
      for (const dayData of days) {
        const { day_number, day_muscle_groups, movements } = dayData;

        // ایجاد روز تمرین
        const day = new Day({
          day_number,
          day_muscle_groups,
          day_workout_id: savedWorkout._id,
          day_movements: [],
          day_is_active: true,
        });

        const savedDay = await day.save();

        // ایجاد حرکات برای این روز
        if (movements && Array.isArray(movements)) {
          const savedMovements = await Promise.all(
            movements.map(async (movementData) => {
              const movement = new Movement({
                ...movementData,
                movement_workout_id: savedWorkout._id,
                movement_day_id: savedDay._id,
                movement_is_active: true,
              });
              return await movement.save();
            })
          );

          // آپدیت day_movements با شناسه‌های حرکات
          savedDay.day_movements = savedMovements.map(
            (m) => m._id as mongoose.Types.ObjectId
          );
          await savedDay.save();
        }
      }
    }

    res.status(201).json({
      success: true,
      message: "برنامه تمرینی با موفقیت ایجاد شد",
      data: {
        ...savedWorkout.toObject(),
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
