import { Router } from "express";
import { Program } from "../models";

const router = Router();

// POST /api/programs - Create a new program
router.post("/", async (req, res) => {
  try {
    const programData = req.body;

    // TODO: Add your database save logic here
    // Example with Prisma:
    // const savedProgram = await prisma.program.create({
    //   data: programData
    // });

    res.status(201).json({
      success: true,
      message: "برنامه با موفقیت ذخیره شد",
      data: programData,
    });
  } catch (error) {
    console.error("Error saving program:", error);
    res.status(500).json({
      success: false,
      message: "خطا در ذخیره برنامه",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
