import { MUSCLE_GROUPS, DIFFICULTY_LEVELS, EQUIPMENT_TYPES, MOVEMENT_TYPES, SET_TYPES } from '../../constants/enums';

export const validateMovementData = (data: any) => {
  const errors: string[] = [];

  // Validate name
  if (!data.name || typeof data.name !== 'string') {
    errors.push('نام حرکت الزامی است');
  }

  // Validate description
  if (!data.description || typeof data.description !== 'string') {
    errors.push('توضیحات حرکت الزامی است');
  }

  // Validate type
  if (!data.type || !MOVEMENT_TYPES.includes(data.type)) {
    errors.push('نوع حرکت الزامی است و باید یکی از مقادیر معتبر باشد');
  }

  // Validate muscle group
  if (!data.muscleGroup || !MUSCLE_GROUPS.includes(data.muscleGroup)) {
    errors.push('گروه عضلانی الزامی است و باید یکی از مقادیر معتبر باشد');
  }

  // Validate difficulty
  if (!data.difficulty || !DIFFICULTY_LEVELS.includes(data.difficulty)) {
    errors.push('سطح سختی الزامی است و باید یکی از مقادیر معتبر باشد');
  }

  // Validate workout ID
  if (!data.workoutId || typeof data.workoutId !== 'number') {
    errors.push('شناسه برنامه تمرینی الزامی است');
  }

  // Validate day ID
  if (!data.dayId || typeof data.dayId !== 'number') {
    errors.push('شناسه روز تمرین الزامی است');
  }

  // Validate order
  if (!data.order || typeof data.order !== 'number') {
    errors.push('ترتیب حرکت الزامی است');
  }

  // Validate equipment (optional)
  if (data.equipment && Array.isArray(data.equipment)) {
    for (const item of data.equipment) {
      if (!EQUIPMENT_TYPES.includes(item)) {
        errors.push(`تجهیزات نامعتبر: ${item}`);
      }
    }
  }

  // Validate set types (optional)
  if (data.setTypes && Array.isArray(data.setTypes)) {
    for (const setType of data.setTypes) {
      if (!setType.type || !SET_TYPES.includes(setType.type)) {
        errors.push(`نوع ست نامعتبر: ${setType.type}`);
      }
      if (!setType.config) {
        errors.push('تنظیمات ست الزامی است');
      }
    }
  }

  // Validate sets
  if (!data.sets || typeof data.sets !== 'number') {
    errors.push('تعداد ست الزامی است');
  } else if (data.sets < 1 || data.sets > 20) {
    errors.push('تعداد ست باید بین ۱ تا ۲۰ باشد');
  }

  // Validate reps
  if (!data.reps || typeof data.reps !== 'number') {
    errors.push('تعداد تکرار الزامی است');
  } else if (data.reps < 1 || data.reps > 100) {
    errors.push('تعداد تکرار باید بین ۱ تا ۱۰۰ باشد');
  }

  // Validate rest time
  if (!data.restTime || typeof data.restTime !== 'number') {
    errors.push('زمان استراحت الزامی است');
  } else if (data.restTime < 0 || data.restTime > 300) {
    errors.push('زمان استراحت باید بین ۰ تا ۳۰۰ ثانیه باشد');
  }

  // Validate tempo
  if (data.tempo && typeof data.tempo === 'string') {
    const tempoPattern = /^\d{1,2}-\d{1,2}-\d{1,2}-\d{1,2}$/;
    if (!tempoPattern.test(data.tempo)) {
      errors.push('فرمت تمپو نامعتبر است (مثال: 3-1-1-1)');
    }
  }

  // Validate weight
  if (!data.weight || typeof data.weight !== 'number') {
    errors.push('وزنه الزامی است');
  } else if (data.weight < 0) {
    errors.push('وزنه نمی‌تواند منفی باشد');
  }

  // Validate weight unit
  if (data.weightUnit && !['kg', 'lb'].includes(data.weightUnit)) {
    errors.push('واحد وزن باید kg یا lb باشد');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}; 