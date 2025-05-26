import { Router, Request, Response, RequestHandler } from "express";
import { Program, IProgram } from "../models/program";

const router = Router();

interface ProgramParams {
  username: string;
  id: string;
}

// POST /programs - Create a new program
const createProgram: RequestHandler = async (req, res) => {
  try {
    const programData = req.body;

    // Create new program document
    const program = new Program(programData);

    // Save to database
    const savedProgram = await program.save();

    res.status(201).json({
      success: true,
      message: "برنامه با موفقیت ذخیره شد",
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

// GET /programs/:username/:id - Get program by username and ID
const getProgram: RequestHandler<ProgramParams> = async (req, res) => {
  try {
    const { username, id } = req.params;

    const program = await Program.findOne({
      programName: username,
      _id: id,
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

router.post("/", createProgram);
router.get("/:username/:id", getProgram);

export default router;
