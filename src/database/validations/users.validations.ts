import { TRAINING_EXPERIENCE_LEVELS, TRAINING_GOALS, MEDICAL_CONDITIONS, INJURIES } from '../../constants/enums';

export const validateUserData = (data: any) => {
  const errors: string[] = [];

  // Validate phone number
  if (!data.phoneNumber || typeof data.phoneNumber !== 'string') {
    errors.push('شماره تماس الزامی است');
  }

  // Validate name
  if (!data.name || typeof data.name !== 'string') {
    errors.push('نام الزامی است');
  }

  // Validate age
  if (!data.age || typeof data.age !== 'number') {
    errors.push('سن الزامی است');
  } else if (data.age < 12 || data.age > 100) {
    errors.push('سن باید بین ۱۲ تا ۱۰۰ سال باشد');
  }

  // Validate height
  if (!data.height || typeof data.height !== 'number') {
    errors.push('قد الزامی است');
  } else if (data.height < 100 || data.height > 250) {
    errors.push('قد باید بین ۱۰۰ تا ۲۵۰ سانتی‌متر باشد');
  }

  // Validate weight
  if (!data.weight || typeof data.weight !== 'number') {
    errors.push('وزن الزامی است');
  } else if (data.weight < 30 || data.weight > 300) {
    errors.push('وزن باید بین ۳۰ تا ۳۰۰ کیلوگرم باشد');
  }

  // Validate training experience
  if (!data.trainingExperience || !TRAINING_EXPERIENCE_LEVELS.includes(data.trainingExperience)) {
    errors.push('سابقه تمرین الزامی است و باید یکی از مقادیر معتبر باشد');
  }

  // Validate training goals (optional)
  if (data.trainingGoals && Array.isArray(data.trainingGoals)) {
    for (const goal of data.trainingGoals) {
      if (!TRAINING_GOALS.includes(goal)) {
        errors.push(`هدف تمرین نامعتبر: ${goal}`);
      }
    }
  }

  // Validate medical conditions (optional)
  if (data.medicalConditions && Array.isArray(data.medicalConditions)) {
    for (const condition of data.medicalConditions) {
      if (!MEDICAL_CONDITIONS.includes(condition)) {
        errors.push(`شرایط پزشکی نامعتبر: ${condition}`);
      }
    }
  }

  // Validate injuries (optional)
  if (data.injuries && Array.isArray(data.injuries)) {
    for (const injury of data.injuries) {
      if (!INJURIES.includes(injury)) {
        errors.push(`آسیب نامعتبر: ${injury}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};