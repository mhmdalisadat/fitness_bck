import { MUSCLE_GROUPS } from '../../constants/enums';

export const validateWorkoutDayData = (data: any) => {
  const errors: string[] = [];

  // Validate day number
  if (!data.dayNumber || typeof data.dayNumber !== 'number') {
    errors.push('شماره روز الزامی است');
  } else if (data.dayNumber < 1) {
    errors.push('شماره روز باید حداقل ۱ باشد');
  }

  // Validate muscle groups
  if (!data.dayMuscleGroups || !Array.isArray(data.dayMuscleGroups)) {
    errors.push('گروه‌های عضلانی الزامی است');
  } else {
    for (const muscleGroup of data.dayMuscleGroups) {
      if (!MUSCLE_GROUPS.includes(muscleGroup)) {
        errors.push(`گروه عضلانی نامعتبر: ${muscleGroup}`);
      }
    }
  }

  // Validate workout ID
  if (!data.dayWorkoutId || typeof data.dayWorkoutId !== 'number') {
    errors.push('شناسه برنامه تمرینی الزامی است');
  }

  // Validate movements (optional)
  if (data.dayMovements && Array.isArray(data.dayMovements)) {
    for (const movementId of data.dayMovements) {
      if (typeof movementId !== 'number') {
        errors.push('شناسه حرکت باید عدد باشد');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 