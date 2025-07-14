import { IsString, IsNumber, IsArray, IsOptional, Min, Max, IsIn } from 'class-validator';
import { TRAINING_EXPERIENCE_LEVELS, TRAINING_GOALS, MEDICAL_CONDITIONS, INJURIES } from '../../constants/enums';

export class CreateUserDto {
  @IsString()
  phoneNumber: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(12)
  @Max(100)
  age: number;

  @IsNumber()
  @Min(100)
  @Max(250)
  height: number;

  @IsNumber()
  @Min(30)
  @Max(300)
  weight: number;

  @IsString()
  @IsIn(TRAINING_EXPERIENCE_LEVELS)
  trainingExperience: (typeof TRAINING_EXPERIENCE_LEVELS)[number];

  @IsOptional()
  @IsArray()
  @IsIn(TRAINING_GOALS, { each: true })
  trainingGoals?: (typeof TRAINING_GOALS)[number][];

  @IsOptional()
  @IsArray()
  @IsIn(MEDICAL_CONDITIONS, { each: true })
  medicalConditions?: (typeof MEDICAL_CONDITIONS)[number][];

  @IsOptional()
  @IsArray()
  @IsIn(INJURIES, { each: true })
  injuries?: (typeof INJURIES)[number][];
} 