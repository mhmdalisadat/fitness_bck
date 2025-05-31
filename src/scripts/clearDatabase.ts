import mongoose from "mongoose";
import { Workout } from "../models/workout";
import { User } from "../models/user";
import { Day } from "../models/day";
import { Movement } from "../models/movement";

async function clearDatabase() {
  try {
    // اتصال به دیتابیس
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/fitness_db"
    );
    console.log("Connected to database");

    // پاک کردن تمام کالکشن‌ها
    await Workout.deleteMany({});
    await User.deleteMany({});
    await Day.deleteMany({});
    await Movement.deleteMany({});

    console.log("All collections cleared successfully");
  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
  }
}

clearDatabase();
