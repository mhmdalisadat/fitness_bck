import { Router, Request, Response, RequestHandler } from "express";
import { Program, IProgram } from "../models";

const router = Router();

// Define interface for day structure
interface IDay {
  day: number;
  targetMuscles: string[];
  exercises: any[];
}

// POST /api/programs - Create a new program
const createProgram: RequestHandler = async (req, res) => {
  try {
    const programData = req.body;
    console.log("Received program data:", programData);

    // Validate required fields
    const requiredFields = [
      "programName",
      "daysPerWeek",
      "description",
      "name",
      "height",
      "weight",
      "purpose",
      "trainingSystem",
      "days",
    ];

    const missingFields = requiredFields.filter((field) => !programData[field]);

    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        message: "فیلدهای اجباری خالی هستند",
        missingFields: missingFields,
      });
      return;
    }

    // Validate days array
    if (!Array.isArray(programData.days) || programData.days.length === 0) {
      res.status(400).json({
        success: false,
        message: "حداقل یک روز تمرین باید تعریف شود",
      });
      return;
    }

    // Create new program document
    const program = new Program(programData);

    // Save to database
    const savedProgram = await program.save();

    res.status(201).json({
      success: true,
      message: "برنامه با موفقیت ذخیره شد",
      programId: savedProgram.programId,
      data: savedProgram,
    });
  } catch (error) {
    console.error("Error saving program:", error);
    res.status(500).json({
      success: false,
      message: "خطا در ذخیره برنامه",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// GET /api/programs/:programId - Get program by ID
const getProgram: RequestHandler = async (req, res) => {
  try {
    const { programId } = req.params;

    const program = await Program.findOne({ programId });

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

router.post("/programs", createProgram);
router.get("/programs/:programId", getProgram);

export default router;
