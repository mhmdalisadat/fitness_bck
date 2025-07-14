import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { users, workouts } from '../database/schema';
import { eq } from 'drizzle-orm';
import { ICreateUserInput, IUser } from '../types/users.type';
import { validateUserData } from '../database/validations/users.validations';
import { TRAINING_GOALS } from '../constants/enums';
import { MEDICAL_CONDITIONS } from '../constants/enums';
import { INJURIES } from '../constants/enums';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createUser(userData: ICreateUserInput): Promise<IUser> {
    const db = this.databaseService.getDb();

    // اعتبارسنجی داده‌ها
    const validation = validateUserData(userData);
    if (!validation.isValid) {
      throw new HttpException(
        {
          success: false,
          message: "فیلدهای اجباری خالی هستند",
          errors: validation.errors,
          required_fields: [
            "phoneNumber",
            "name", 
            "age",
            "height",
            "weight",
            "trainingExperience",
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // بررسی تکراری نبودن شماره تماس
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, userData.phoneNumber));

    if (existingUser.length > 0) {
      throw new HttpException(
        {
          success: false,
          message: "کاربر با این شماره تماس قبلاً ثبت شده است",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // ایجاد کاربر جدید
    const newUser = {
      phoneNumber: userData.phoneNumber,
      name: userData.name,
      age: userData.age,
      height: userData.height,
      weight: userData.weight,
      trainingExperience: userData.trainingExperience,
      trainingGoals: userData.trainingGoals ? JSON.stringify(userData.trainingGoals) : null,
      medicalConditions: userData.medicalConditions ? JSON.stringify(userData.medicalConditions) : null,
      injuries: userData.injuries ? JSON.stringify(userData.injuries) : null,
      isActive: true,
    };

    const result = await db.insert(users).values(newUser).returning();

    // تبدیل نتیجه به نوع IUser
    const createdUser = result[0];

    return {
      ...createdUser,
      trainingExperience: createdUser.trainingExperience as IUser['trainingExperience'],
      isActive: createdUser.isActive ?? true,
      createdAt: createdUser.createdAt ?? new Date(),
      updatedAt: createdUser.updatedAt ?? new Date(),
      trainingGoals: createdUser.trainingGoals ? JSON.parse(createdUser.trainingGoals) : [],
      medicalConditions: createdUser.medicalConditions ? JSON.parse(createdUser.medicalConditions) : [],
      injuries: createdUser.injuries ? JSON.parse(createdUser.injuries) : [],
    } as IUser;
  }

  async getUserInfo(phoneNumber: string): Promise<{ user: IUser; workouts: Array<{
    workoutName: string;
    workoutDescription: string;
    workoutDifficulty: string;
    workoutDaysPerWeek: number;
    workoutDuration: number;
    workoutDurationUnit: string;
    workoutRating: string | null;
    workoutNumberOfRatings: number | null;
    workoutIsActive: boolean | null;
  }> }> {
    const db = this.databaseService.getDb();

    // بررسی وجود شماره تماس
    if (!phoneNumber) {
      throw new HttpException(
        {
          success: false,
          message: "شماره تماس الزامی است",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // جستجوی کاربر
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber));

    if (userResult.length === 0) {
      throw new HttpException(
        {
          success: false,
          message: "کاربر مورد نظر یافت نشد",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const user = userResult[0];

    // جستجوی برنامه‌های تمرینی کاربر
    const workoutsResult = await db
      .select({
        workoutName: workouts.workoutName,
        workoutDescription: workouts.workoutDescription,
        workoutDifficulty: workouts.workoutDifficulty,
        workoutDaysPerWeek: workouts.workoutDaysPerWeek,
        workoutDuration: workouts.workoutDuration,
        workoutDurationUnit: workouts.workoutDurationUnit,
        workoutRating: workouts.workoutRating,
        workoutNumberOfRatings: workouts.workoutNumberOfRatings,
        workoutIsActive: workouts.workoutIsActive,
      })
      .from(workouts)
      .where(
        eq(workouts.workoutCreatedBy, phoneNumber) && 
        eq(workouts.workoutIsActive, true),
      );

    // تبدیل کاربر به نوع IUser
    const userWithParsedArrays: IUser = {
      ...user,
      trainingExperience: user.trainingExperience as IUser['trainingExperience'],
      isActive: user.isActive ?? true,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
      trainingGoals: user.trainingGoals
        ? (JSON.parse(user.trainingGoals) as IUser['trainingGoals']).filter((goal): goal is IUser['trainingGoals'][number] =>
            (TRAINING_GOALS as readonly string[]).includes(goal)
          )
        : [],
      medicalConditions: user.medicalConditions
        ? (JSON.parse(user.medicalConditions) as IUser['medicalConditions']).filter((cond): cond is IUser['medicalConditions'][number] =>
            (MEDICAL_CONDITIONS as readonly string[]).includes(cond)
          )
        : [],
      injuries: user.injuries
        ? (JSON.parse(user.injuries) as IUser['injuries']).filter((inj): inj is IUser['injuries'][number] =>
            (INJURIES as readonly string[]).includes(inj)
          )
        : [],
    };

    return {
      user: userWithParsedArrays,
      workouts: workoutsResult,
    };
  }

  // متدهای موجود برای سازگاری
  async findAll(): Promise<IUser[]> {
    const db = this.databaseService.getDb();
    const result = await db.select().from(users);

    return result.map(user => ({
      ...user,
      trainingExperience: user.trainingExperience as IUser['trainingExperience'],
      isActive: user.isActive ?? true,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
      trainingGoals: user.trainingGoals ? JSON.parse(user.trainingGoals) : [],
      medicalConditions: user.medicalConditions ? JSON.parse(user.medicalConditions) : [],
      injuries: user.injuries ? JSON.parse(user.injuries) : [],
    })) as IUser[];
  }

  async findById(id: number): Promise<IUser | undefined> {
    const db = this.databaseService.getDb();
    const result = await db.select().from(users).where(eq(users.id, id));

    if (result.length === 0) return undefined;

    const user = result[0];

    return {
      ...user,
      trainingExperience: user.trainingExperience as IUser['trainingExperience'],
      isActive: user.isActive ?? true,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
      trainingGoals: user.trainingGoals ? JSON.parse(user.trainingGoals) : [],
      medicalConditions: user.medicalConditions ? JSON.parse(user.medicalConditions) : [],
      injuries: user.injuries ? JSON.parse(user.injuries) : [],
    } as IUser;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<IUser | undefined> {
    const db = this.databaseService.getDb();
    const result = await db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber));

    if (result.length === 0) return undefined;

    const user = result[0];
    
    return {
      ...user,
      trainingExperience: user.trainingExperience as IUser['trainingExperience'],
      isActive: user.isActive ?? true,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
      trainingGoals: user.trainingGoals ? JSON.parse(user.trainingGoals) : [],
      medicalConditions: user.medicalConditions ? JSON.parse(user.medicalConditions) : [],
      injuries: user.injuries ? JSON.parse(user.injuries) : [],
    } as IUser;
  }

  async update(id: number, userData: Partial<typeof users.$inferInsert>): Promise<IUser | undefined> {
    const db = this.databaseService.getDb();

    // تبدیل آرایه‌ها به JSON string اگر وجود داشته باشند
    const updateData = {
      ...userData,
      trainingGoals: userData.trainingGoals ? JSON.stringify(userData.trainingGoals) : undefined,
      medicalConditions: userData.medicalConditions ? JSON.stringify(userData.medicalConditions) : undefined,
      injuries: userData.injuries ? JSON.stringify(userData.injuries) : undefined,
      updatedAt: new Date(),
    };

    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    if (result.length === 0) return undefined;

    const user = result[0];

    return {
      ...user,
      trainingExperience: user.trainingExperience as IUser['trainingExperience'],
      isActive: user.isActive ?? true,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
      trainingGoals: user.trainingGoals ? JSON.parse(user.trainingGoals) : [],
      medicalConditions: user.medicalConditions ? JSON.parse(user.medicalConditions) : [],
      injuries: user.injuries ? JSON.parse(user.injuries) : [],
    } as IUser;
  }

  async delete(id: number): Promise<IUser | undefined> {
    const db = this.databaseService.getDb();
    const result = await db.delete(users).where(eq(users.id, id)).returning();

    if (result.length === 0) return undefined;

    const user = result[0];
    
    return {
      ...user,
      trainingExperience: user.trainingExperience as IUser['trainingExperience'],
      isActive: user.isActive ?? true,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
      trainingGoals: user.trainingGoals ? JSON.parse(user.trainingGoals) : [],
      medicalConditions: user.medicalConditions ? JSON.parse(user.medicalConditions) : [],
      injuries: user.injuries ? JSON.parse(user.injuries) : [],
    } as IUser;
  }
} 