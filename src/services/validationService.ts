import { IWorkoutData, IDayData } from "../types/workout";
import { MUSCLE_GROUPS } from "../constants/enums";

export class ValidationService {
  static validateWorkoutData(data: IWorkoutData): string | null {
    if (!data.workout_name?.trim()) return "نام برنامه تمرینی الزامی است";
    if (!data.workout_description?.trim())
      return "توضیحات برنامه تمرینی الزامی است";
    if (
      !data.workout_days_per_week ||
      data.workout_days_per_week < 1 ||
      data.workout_days_per_week > 7
    )
      return "تعداد روزهای تمرین در هفته باید بین ۱ تا ۷ باشد";
    if (
      !data.workout_weeks ||
      data.workout_weeks < 1 ||
      data.workout_weeks > 52
    )
      return "تعداد هفته‌های برنامه باید بین ۱ تا ۵۲ باشد";
    return null;
  }

  static validateDayData(dayData: IDayData): string | null {
    if (
      !dayData.day_number ||
      dayData.day_number < 1 ||
      dayData.day_number > 7
    ) {
      return "شماره روز باید بین ۱ تا ۷ باشد";
    }

    if (!dayData.day_muscle_groups?.length) {
      return "حداقل یک گروه عضلانی برای روز الزامی است";
    }

    const invalidMuscleGroups = dayData.day_muscle_groups.filter(
      (group) => !MUSCLE_GROUPS.includes(group)
    );

    if (invalidMuscleGroups.length > 0) {
      return `گروه‌های عضلانی نامعتبر: ${invalidMuscleGroups.join(", ")}`;
    }

    return null;
  }

  static validateDays(days: IDayData[]): string | null {
    if (!days?.length) return null;

    // Check for duplicate day numbers
    const dayNumbers = days.map((day) => day.day_number);
    const uniqueDayNumbers = new Set(dayNumbers);
    if (dayNumbers.length !== uniqueDayNumbers.size) {
      return "شماره روزها نباید تکراری باشند";
    }

    // Validate each day
    for (const dayData of days) {
      const validationError = this.validateDayData(dayData);
      if (validationError) {
        return `خطا در اعتبارسنجی روز ${dayData.day_number}: ${validationError}`;
      }
    }

    return null;
  }
}
