import { Router } from "express";
import { handleWorkout } from "../controllers/workoutController";

const router = Router();

// ایجاد برنامه تمرینی جدید
router.post("/workouts", handleWorkout);

// آپدیت برنامه تمرینی با UUID
router.put("/workouts/:workoutId", handleWorkout);




export default router;
