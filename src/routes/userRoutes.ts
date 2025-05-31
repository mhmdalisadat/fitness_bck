import { Router } from "express";
import { getUserInfo, createUser } from "../controllers/userController";

const router = Router();

// POST /api/users - ایجاد کاربر جدید
router.post("/users", createUser);

// GET /api/users/:phoneNumber - دریافت اطلاعات کاربر
router.get("/users/:phoneNumber", getUserInfo);

export default router;
