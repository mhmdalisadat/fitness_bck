export const validateWorkoutData = (data: any) => {
  const errors: string[] = [];

  // Validate workout name
  if (!data.workoutName || typeof data.workoutName !== 'string') {
    errors.push('نام برنامه تمرینی الزامی است');
  }

  // Validate workout description
  if (!data.workoutDescription || typeof data.workoutDescription !== 'string') {
    errors.push('توضیحات برنامه تمرینی الزامی است');
  }

  // Validate workout days per week
  if (!data.workoutDaysPerWeek || typeof data.workoutDaysPerWeek !== 'number') {
    errors.push('تعداد روزهای تمرین در هفته الزامی است');
  } else if (data.workoutDaysPerWeek < 1 || data.workoutDaysPerWeek > 7) {
    errors.push('تعداد روزهای تمرین در هفته باید بین ۱ تا ۷ باشد');
  }

  // Validate workout weeks
  if (!data.workoutWeeks || typeof data.workoutWeeks !== 'number') {
    errors.push('تعداد هفته‌های برنامه تمرینی الزامی است');
  } else if (data.workoutWeeks < 1 || data.workoutWeeks > 52) {
    errors.push('تعداد هفته‌های برنامه باید بین ۱ تا ۵۲ باشد');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}; 