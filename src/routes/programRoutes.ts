import { Router, RequestHandler } from "express";
import { Program } from "../models/program";

const router = Router();

interface ProgramParams {
  username: string;
  id: string;
}

// POST /programs - Create a new program
const createProgram: RequestHandler = async (req, res) => {
  try {
    const programData = req.body;
    console.log("Received data:", programData);

    const existingProgram = await Program.findOne({
      name: programData.name,
      programName: programData.programName,
    });

    if (existingProgram) {
      res.status(400).json({
        success: false,
        message: "برنامه با این نام و نام کاربری قبلاً ثبت شده است",
      });
      return;
    }

    const program = new Program(programData);
    const savedProgram = await program.save();

    res.status(201).json({
      success: true,
      message: "برنامه با موفقیت ذخیره شد",
      data: savedProgram,
    });
  } catch (error: any) {
    console.error("Error saving program:", error);

    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: "برنامه با این نام و نام کاربری قبلاً ثبت شده است",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "خطا در ذخیره برنامه",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// GET /programs/:username/:id - Get program by username and ID
const getProgram: RequestHandler<ProgramParams> = async (req, res) => {
  try {
    const { username, id } = req.params;

    const program = await Program.findOne({
      programName: username,
      programId: id,
    });

    if (!program) {
      res.status(404).json({
        success: false,
        message: "برنامه مورد نظر یافت نشد",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "برنامه با موفقیت دریافت شد",
      data: program,
    });
  } catch (error) {
    console.error("Error fetching program:", error);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت برنامه",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// DELETE /programs/clear - Clear all programs (development only)
const clearDatabase: RequestHandler = async (req, res) => {
  if (process.env.NODE_ENV !== "development") {
    res.status(403).json({
      success: false,
      message: "این عملیات فقط در محیط توسعه مجاز است",
    });
    return;
  }

  try {
    await Program.deleteMany({});
    res.status(200).json({
      success: true,
      message: "تمام برنامه‌ها با موفقیت حذف شدند",
    });
  } catch (error: any) {
    console.error("Error clearing database:", error);
    res.status(500).json({
      success: false,
      message: "خطا در پاک کردن دیتابیس",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

router.post("/programs", createProgram);
router.post("/programs/", createProgram);
router.get("/programs/:username/:id", getProgram);
router.get("/programs/:username/:id/", getProgram);
router.delete("/programs/clear", clearDatabase);
router.delete("/programs/clear/", clearDatabase);

export default router;
