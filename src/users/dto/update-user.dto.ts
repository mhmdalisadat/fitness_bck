import { IsString, IsNumber, IsArray, IsOptional, Min, Max, IsIn, IsBoolean } from 'class-validator';
import { TRAINING_EXPERIENCE_LEVELS, TRAINING_GOALS, MEDICAL_CONDITIONS, INJURIES } from '../../constants/enums';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(12)
  @Max(100)
  age?: number;

  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(250)
  height?: number;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(300)
  weight?: number;

  @IsOptional()
  @IsString()
  @IsIn(TRAINING_EXPERIENCE_LEVELS)
  trainingExperience?: (typeof TRAINING_EXPERIENCE_LEVELS)[number];

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

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 