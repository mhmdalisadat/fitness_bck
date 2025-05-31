import { Request, Response, RequestHandler } from "express";
import { User, Workout } from "../models";

// ایجاد کاربر جدید
export const createUser: RequestHandler<any, any, any, any> = async (
  req,
  res
) => {
  try {
    const {
      phoneNumber,
      name,
      age,
      height,
      weight,
      trainingExperience,
      trainingGoals,
      medicalConditions,
      injuries,
      preferredTrainingDays,
      preferredTrainingTime,
      profileImage,
    } = req.body;

    if (
      !phoneNumber ||
      !name ||
      !age ||
      !height ||
      !weight ||
      !trainingExperience
    ) {
      res.status(400).json({
        success: false,
        message: "فیلدهای اجباری خالی هستند",
        required_fields: [
          "phoneNumber",
          "name",
          "age",
          "height",
          "weight",
          "trainingExperience",
        ],
      });
      return;
    }

    // بررسی تکراری نبودن شماره تماس
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "کاربر با این شماره تماس قبلاً ثبت شده است",
      });
      return;
    }

    // ایجاد کاربر جدید
    const user = new User({
      phoneNumber,
      name,
      age,
      height,
      weight,
      trainingExperience,
      trainingGoals: trainingGoals || [],
      medicalConditions: medicalConditions || [],
      injuries: injuries || [],
      preferredTrainingDays: preferredTrainingDays || [],
      preferredTrainingTime: preferredTrainingTime || "morning",
      profileImage: profileImage || "",
      isActive: true,
    });

    // ذخیره کاربر در دیتابیس
    const savedUser = await user.save();

    res.status(201).json({
      success: true,
      message: "کاربر با موفقیت ایجاد شد",
      data: {
        user: {
          phoneNumber: savedUser.phoneNumber,
          name: savedUser.name,
          age: savedUser.age,
          height: savedUser.height,
          weight: savedUser.weight,
          trainingExperience: savedUser.trainingExperience,
          trainingGoals: savedUser.trainingGoals,
          medicalConditions: savedUser.medicalConditions,
          injuries: savedUser.injuries,
          preferredTrainingDays: savedUser.preferredTrainingDays,
          preferredTrainingTime: savedUser.preferredTrainingTime,
          bmi: (savedUser.weight / Math.pow(savedUser.height / 100, 2)).toFixed(
            1
          ),
        },
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "خطا در ایجاد کاربر",
      error: error instanceof Error ? error.message : "خطای ناشناخته",
    });
  }
};

// دریافت اطلاعات کاربر
export const getUserInfo: RequestHandler<any, any, any, any> = async (
  req,
  res
) => {
  try {
    const { phoneNumber } = req.params;

    // بررسی وجود شماره تماس
    if (!phoneNumber) {
      res.status(400).json({
        success: false,
        message: "شماره تماس الزامی است",
      });
      return;
    }

    // جستجوی کاربر
    const user = await User.findOne({ phoneNumber }).select("-__v"); // حذف فیلد __v از خروجی

    if (!user) {
      res.status(404).json({
        success: false,
        message: "کاربر مورد نظر یافت نشد",
      });
      return;
    }

    // جستجوی برنامه‌های تمرینی کاربر
    const workouts = await Workout.find({
      workout_created_by: phoneNumber,
      workout_is_active: true,
    }).select(
      "workout_name workout_description workout_difficulty workout_days_per_week workout_duration workout_duration_unit workout_rating workout_number_of_ratings workout_is_active"
    );

    res.status(200).json({
      success: true,
      message: "اطلاعات کاربر با موفقیت دریافت شد",
      data: {
        user: {
          phoneNumber: user.phoneNumber,
          name: user.name,
          age: user.age,
          height: user.height,
          weight: user.weight,
          trainingExperience: user.trainingExperience,
          trainingGoals: user.trainingGoals,
          medicalConditions: user.medicalConditions,
          injuries: user.injuries,
          preferredTrainingDays: user.preferredTrainingDays,
          preferredTrainingTime: user.preferredTrainingTime,
          bmi: (user.weight / Math.pow(user.height / 100, 2)).toFixed(1),
        },
        workouts,
      },
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت اطلاعات کاربر",
      error: error instanceof Error ? error.message : "خطای ناشناخته",
    });
  }
};
