import { Request, Response } from "express";
import { Workout, User, Day, Movement } from "../models";
import { IUser } from "../models/user";
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
  [key: string]: any; // اضافه کردن index signature
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
  [key: string]: any; // اضافه کردن index signature
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

// اعتبارسنجی داده‌های روز
const validateDayData = (dayData: IDayData): string | null => {
  if (!dayData.day_number || dayData.day_number < 1 || dayData.day_number > 7) {
    return "شماره روز باید بین ۱ تا ۷ باشد";
  }

  if (!dayData.day_muscle_groups?.length) {
    return "حداقل یک گروه عضلانی برای روز الزامی است";
  }

  // بررسی معتبر بودن گروه‌های عضلانی
  const invalidMuscleGroups = dayData.day_muscle_groups.filter(
    (group) => !MUSCLE_GROUPS.includes(group)
  );

  if (invalidMuscleGroups.length > 0) {
    return `گروه‌های عضلانی نامعتبر: ${invalidMuscleGroups.join(", ")}`;
  }

  return null;
};

export const handleWorkout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { workoutId } = req.params;
    const data = parseNumericFields(req.body) as IWorkoutData;
    const isPatchRequest = req.method === "PATCH";

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
          // در PATCH فقط فیلدهای ارسال شده آپدیت می‌شوند
          if (isPatchRequest) {
            Object.keys(data.user || {}).forEach((key) => {
              if (data.user?.[key] !== undefined) {
                (existingUser as any)[key] =
                  data.user?.[key as keyof IUserData];
              }
            });
          } else {
            Object.assign(existingUser, data.user);
          }
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
      if (!isPatchRequest) {
        const validationError = validateWorkoutData(data);
        if (validationError) {
          res.status(400).json({
            success: false,
            message: validationError,
          });
          return;
        }
      }

      // آپدیت اطلاعات برنامه
      if (isPatchRequest) {
        // در PATCH فقط فیلدهای ارسال شده آپدیت می‌شوند
        Object.keys(data).forEach((key) => {
          if (key !== "user" && key !== "days" && data[key] !== undefined) {
            (workout as any)[key] = data[key as keyof IWorkoutData];
          }
        });

        // آپدیت روزها اگر ارسال شده باشند
        if (data.days?.length) {
          // اعتبارسنجی روزها
          for (const dayData of data.days) {
            const validationError = validateDayData(dayData);
            if (validationError) {
              res.status(400).json({
                success: false,
                message: `خطا در اعتبارسنجی روز ${dayData.day_number}: ${validationError}`,
              });
              return;
            }
          }

          // بررسی تکراری نبودن شماره روزها
          const dayNumbers = data.days.map((day) => day.day_number);
          const uniqueDayNumbers = new Set(dayNumbers);
          if (dayNumbers.length !== uniqueDayNumbers.size) {
            res.status(400).json({
              success: false,
              message: "شماره روزها نباید تکراری باشند",
            });
            return;
          }

          // حذف روزهای قبلی
          await Day.deleteMany({ day_workout_id: workout._id });

          // ایجاد روزهای جدید
          const savedDays = await Promise.all(
            data.days.map(async (dayData) => {
              const day = new Day({
                day_number: dayData.day_number,
                day_muscle_groups: dayData.day_muscle_groups,
                day_workout_id: workout._id,
                day_movements: [],
                day_is_active: true,
              });
              return await day.save();
            })
          );

          // آپدیت آرایه روزها در workout
          workout.days = savedDays.map(
            (day) => day._id as mongoose.Types.ObjectId
          );
        }
      } else {
        // در PUT همه فیلدها آپدیت می‌شوند
        Object.assign(workout, {
          workout_name: data.workout_name,
          workout_description: data.workout_description,
          workout_days_per_week: data.workout_days_per_week,
          workout_weeks: data.workout_weeks,
        });
      }
      await workout.save();

      // پیدا کردن اطلاعات کاربر
      const user = data.user
        ? await User.findOne({ phoneNumber: data.user.phoneNumber })
        : null;

      // دریافت برنامه با اطلاعات آپدیت شده
      const updatedWorkout = await Workout.findOne({
        workout_id: workoutId,
      }).populate({
        path: "days",
        populate: {
          path: "day_movements",
          model: "Movement",
        },
      });

      res.status(200).json({
        success: true,
        message: "برنامه تمرینی با موفقیت آپدیت شد",
        data: {
          ...updatedWorkout?.toObject(),
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
    let existingUser: IUser | null = null;
    if (data.user) {
      existingUser = await User.findOne({ phoneNumber: data.user.phoneNumber });

      if (!existingUser) {
        existingUser = new User(data.user);
      } else {
        // در PATCH فقط فیلدهای ارسال شده آپدیت می‌شوند
        if (isPatchRequest) {
          Object.keys(data.user || {}).forEach((key) => {
            if (data.user?.[key] !== undefined) {
              (existingUser as any)[key] = data.user?.[key as keyof IUserData];
            }
          });
        } else {
          Object.assign(existingUser, data.user);
        }
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
            dayData.movements.map(async (movementData, index) => {
              const movement = new Movement({
                ...parseMovementFields(movementData),
                movement_workout_id: savedWorkout._id,
                movement_day_id: savedDay._id,
                movement_is_active: true,
                movement_order: index + 1, // اضافه کردن ترتیب حرکت
                movement_set_config: {
                  sets: movementData.movement_sets,
                  reps: movementData.movement_reps,
                  rest_time: movementData.movement_rest_time,
                  rest_time_unit: "seconds",
                },
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

// اضافه کردن حرکت به برنامه
export const handleAddMovement = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { workoutId } = req.params;
    const { day_number, movement } = req.body;

    if (!day_number || !movement) {
      res.status(400).json({
        success: false,
        message: "شماره روز و اطلاعات حرکت الزامی است",
      });
      return;
    }

    // پیدا کردن برنامه
    const workout = await Workout.findOne({ workout_id: workoutId });
    if (!workout) {
      res.status(404).json({
        success: false,
        message: "برنامه تمرینی مورد نظر یافت نشد",
      });
      return;
    }

    // پیدا کردن روز
    let day = await Day.findOne({
      day_workout_id: workout._id,
      day_number: day_number,
    });

    // اگر روز وجود نداشت، ایجاد کن
    if (!day) {
      day = new Day({
        day_number: day_number,
        day_muscle_groups: [movement.movement_muscle_group],
        day_workout_id: workout._id,
        day_movements: [],
        day_is_active: true,
      });
      await day.save();
    }

    // ایجاد حرکت جدید
    const newMovement = new Movement({
      ...parseMovementFields(movement),
      movement_workout_id: workout._id,
      movement_day_id: day._id,
      movement_is_active: true,
      movement_order: (day.day_movements?.length || 0) + 1,
      movement_set_config: {
        sets: movement.movement_sets,
        reps: movement.movement_reps,
        rest_time: movement.movement_rest_time,
        rest_time_unit: "seconds",
      },
    });

    const savedMovement = await newMovement.save();

    // اضافه کردن حرکت به روز
    day.day_movements.push(savedMovement._id as mongoose.Types.ObjectId);
    await day.save();

    // اگر گروه عضلانی حرکت در روز نبود، اضافه کن
    if (!day.day_muscle_groups.includes(movement.movement_muscle_group)) {
      day.day_muscle_groups.push(movement.movement_muscle_group);
      await day.save();
    }

    // دریافت برنامه با اطلاعات آپدیت شده
    const updatedWorkout = await Workout.findOne({
      workout_id: workoutId,
    }).populate({
      path: "days",
      populate: {
        path: "day_movements",
        model: "Movement",
      },
    });

    res.status(201).json({
      success: true,
      message: "حرکت با موفقیت به برنامه اضافه شد",
      data: updatedWorkout,
    });
  } catch (error) {
    console.error("Error adding movement:", error);
    res.status(500).json({
      success: false,
      message: "خطا در اضافه کردن حرکت",
      error: error instanceof Error ? error.message : "خطای ناشناخته",
    });
  }
};
