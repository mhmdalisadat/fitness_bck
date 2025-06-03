import { Request, Response } from "express";
import { WorkoutService } from "../services/workoutService";
import { ValidationService } from "../services/validationService";
import { TransformationService } from "../services/transformationService";
import { IWorkoutData } from "../types/workout";

export const handleWorkout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { workoutId } = req.params;
    const data = TransformationService.parseNumericFields(
      req.body
    ) as IWorkoutData;
    const isPatchRequest = req.method === "PATCH";

    if (workoutId) {
      try {
        const result = await WorkoutService.updateWorkout(
          workoutId,
          data,
          isPatchRequest
        );
        res.status(200).json({
          success: true,
          message: "برنامه تمرینی با موفقیت آپدیت شد",
          data: result,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "برنامه تمرینی مورد نظر یافت نشد"
        ) {
          res.status(404).json({
            success: false,
            message: error.message,
          });
        } else {
          throw error;
        }
      }
      return;
    }

    const validationError = ValidationService.validateWorkoutData(data);
    if (validationError) {
      res.status(400).json({
        success: false,
        message: validationError,
      });
      return;
    }

    if (data.days?.length) {
      const daysValidationError = ValidationService.validateDays(data.days);
      if (daysValidationError) {
        res.status(400).json({
          success: false,
          message: daysValidationError,
        });
        return;
      }
    }

    const result = await WorkoutService.createWorkout(data);
    res.status(201).json({
      success: true,
      message: "برنامه تمرینی با موفقیت ایجاد شد",
      data: result,
    });
  } catch (error) {
    console.error("Error handling workout:", error);
    res.status(500).json({
      success: false,
      message: "خطا در پردازش درخواست",
      error: error instanceof Error ? error.message : "خطای ناشناخته",
    });
  }
};

export const handleAddMovement = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { workoutId } = req.params;
    const { day_number, movement } = req.body;

    if (!day_number || !movement) {
      res.status(400).json({
        success: false,
        message: "شماره روز و اطلاعات حرکت الزامی است",
      });
      return;
    }

    const parsedMovement = TransformationService.parseMovementFields(movement);
    const result = await WorkoutService.addMovement(
      workoutId,
      day_number,
      parsedMovement
    );

    res.status(201).json({
      success: true,
      message: "حرکت با موفقیت به برنامه اضافه شد",
      data: result,
    });
  } catch (error) {
    console.error("Error adding movement:", error);
    res.status(500).json({
      success: false,
      message: "خطا در اضافه کردن حرکت",
      error: error instanceof Error ? error.message : "خطای ناشناخته",
    });
  }
};
