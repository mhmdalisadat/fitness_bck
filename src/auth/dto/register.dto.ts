import { IsString, IsNumber, IsArray, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { TRAINING_EXPERIENCE_LEVELS, TRAINING_GOALS, MEDICAL_CONDITIONS, INJURIES } from '../../constants/enums';

export class RegisterDto {
  @IsString()
  phoneNumber: string;

  @IsString()
  @Min(6)
  password: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(1)
  @Max(120)
  age: number;

  @IsNumber()
  @Min(50)
  @Max(300)
  height: number;

  @IsNumber()
  @Min(20)
  @Max(500)
  weight: number;

  @IsEnum(TRAINING_EXPERIENCE_LEVELS)
  trainingExperience: (typeof TRAINING_EXPERIENCE_LEVELS)[number];

  @IsArray()
  @IsOptional()
  trainingGoals?: (typeof TRAINING_GOALS)[number][];

  @IsArray()
  @IsOptional()
  medicalConditions?: (typeof MEDICAL_CONDITIONS)[number][];

  @IsArray()
  @IsOptional()
  injuries?: (typeof INJURIES)[number][];}