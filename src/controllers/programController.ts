import { Request, Response } from "express";
import { Program } from "../models";

// ایجاد برنامه جدید
export const createProgram = async (req: Request, res: Response) => {
  try {
    const { userId, userName, programName, exercises } = req.body;

    if (!userId || !userName || !programName || !exercises) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProgram = new Program({
      userId,
      userName,
      programName,
      exercises,
    });

    await newProgram.save();
    res.status(201).json({ message: "Program created", program: newProgram });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// دریافت برنامه بر اساس userId
export const getProgramByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const programs = await Program.find({ userId });

    if (!programs || programs.length === 0) {
      return res
        .status(404)
        .json({ message: "No programs found for this user" });
    }

    res.status(200).json(programs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
