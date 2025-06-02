import { Router } from "express";
import {
  handleWorkout,
  handleAddMovement,
} from "../controllers/workoutController";

const router = Router();

// ایجاد برنامه تمرینی جدید
router.post("/workouts", handleWorkout);

// آپدیت کامل برنامه تمرینی
router.put("/workouts/:workoutId", handleWorkout);

// آپدیت جزئی برنامه تمرینی
router.patch("/workouts/:workoutId", handleWorkout);

// اضافه کردن حرکت به برنامه
router.post("/workouts/:workoutId/movements", handleAddMovement);

export default router;
