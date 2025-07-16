/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { users } from '../schemas/users.schema';
import { eq, and, desc, asc, like, sql } from 'drizzle-orm';
import { ICreateUserInput, IUpdateUserInput, IUser, IUserFilters, IPaginationOptions } from '../../types/users.type';
import { TRAINING_GOALS, MEDICAL_CONDITIONS, INJURIES } from '../../constants/enums';
import { SQL } from 'drizzle-orm';

@Injectable()
export class UsersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private getDb(): ReturnType<DatabaseService['getDb']> {
    return this.databaseService.getDb();
  }

  // تبدیل نتیجه دیتابیس به IUser
  private mapToIUser(user: typeof users.$inferSelect): IUser {
    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      name: user.name,
      age: user.age,
      height: user.height,
      weight: user.weight,
      trainingExperience: user.trainingExperience as IUser['trainingExperience'],
      trainingGoals: user.trainingGoals 
        ? JSON.parse(user.trainingGoals as string).filter((goal: string) => TRAINING_GOALS.includes(goal as any))
        : [],
      medicalConditions: user.medicalConditions
        ? JSON.parse(user.medicalConditions as string).filter((cond: string) => MEDICAL_CONDITIONS.includes(cond as any))
        : [],
      injuries: user.injuries
        ? JSON.parse(user.injuries as string).filter((inj: string) => INJURIES.includes(inj as any))
        : [],
      isActive: user.isActive ?? true,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
    };
  }

  // ایجاد کاربر جدید
  async create(userData: ICreateUserInput): Promise<IUser> {
    const db = this.getDb();

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
      isActive: userData.isActive ?? true,
    };

    const result = await db.insert(users).values(newUser).returning();
    return this.mapToIUser(result[0] as typeof users.$inferSelect);
  }

  // پیدا کردن کاربر با ID
  async findById(id: number): Promise<IUser | null> {
    const db = this.getDb();
    const result = await db.select().from(users).where(eq(users.id, id));
    
    if (result.length === 0) return null;
    return this.mapToIUser(result[0]);
  }

  // پیدا کردن کاربر با شماره تلفن
  async findByPhoneNumber(phoneNumber: string): Promise<IUser | null> {
    const db = this.getDb();
    const result = await db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber));

    if (result.length === 0) return null;
    return this.mapToIUser(result[0] as typeof users.$inferSelect);
  }

  // پیدا کردن همه کاربران با فیلتر و صفحه‌بندی
  async findAll(
    filters: IUserFilters = {},
    pagination: IPaginationOptions = {}
  ): Promise<{ users: IUser[]; total: number; page: number; limit: number; totalPages: number }> {
    const db = this.getDb();
    const { page = 1, limit = 10, sortOrder = 'desc' } = pagination;

    // ساخت شرط‌های where
    const whereConditions: SQL[] = [];

    if (filters.isActive !== undefined) {
      whereConditions.push(eq(users.isActive, filters.isActive));
    }

    if (filters.trainingExperience) {
      whereConditions.push(eq(users.trainingExperience, filters.trainingExperience));
    }

    if (filters.ageMin !== undefined) {
      whereConditions.push(sql`${users.age} >= ${filters.ageMin}`);
    }

    if (filters.ageMax !== undefined) {
      whereConditions.push(sql`${users.age} <= ${filters.ageMax}`);
    }

    if (filters.search) {
      whereConditions.push(like(users.name, `%${filters.search}%`));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // تعداد کل
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause);

    const total = countResult[0].count;

    // نتایج صفحه‌بندی شده
    const offset = (page - 1) * limit;
    const orderBy = sortOrder === 'asc' ? asc(users.createdAt) : desc(users.createdAt);

    const result = await db
      .select()
      .from(users)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const mappedUsers = result.map(user => this.mapToIUser(user));

    return {
      users: mappedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // بروزرسانی کاربر
  async update(id: number, userData: IUpdateUserInput): Promise<IUser | null> {
    const db = this.getDb();

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    // فیلدهای ساده
    if (userData.phoneNumber !== undefined) updateData.phoneNumber = userData.phoneNumber;
    if (userData.name !== undefined) updateData.name = userData.name;
    if (userData.age !== undefined) updateData.age = userData.age;
    if (userData.height !== undefined) updateData.height = userData.height;
    if (userData.weight !== undefined) updateData.weight = userData.weight;
    if (userData.trainingExperience !== undefined) updateData.trainingExperience = userData.trainingExperience;
    if (userData.isActive !== undefined) updateData.isActive = userData.isActive;

    // فیلدهای JSON
    if (userData.trainingGoals !== undefined) {
      updateData.trainingGoals = userData.trainingGoals ? JSON.stringify(userData.trainingGoals) : null;
    }
    if (userData.medicalConditions !== undefined) {
      updateData.medicalConditions = userData.medicalConditions ? JSON.stringify(userData.medicalConditions) : null;
    }
    if (userData.injuries !== undefined) {
      updateData.injuries = userData.injuries ? JSON.stringify(userData.injuries) : null;
    }

    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    if (result.length === 0) return null;
    return this.mapToIUser(result[0] as typeof users.$inferSelect);
  }

  // حذف نرم کاربر
  async softDelete(id: number): Promise<IUser | null> {
    const db = this.getDb();
    
    const result = await db
      .update(users)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    if (result.length === 0) return null;
    return this.mapToIUser(result[0] as typeof users.$inferSelect);
  }

  // حذف سخت کاربر
  async hardDelete(id: number): Promise<IUser | null> {
    const db = this.getDb();
    
    const result = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (result.length === 0) return null;
    return this.mapToIUser(result[0] as typeof users.$inferSelect);
  }

  // بازگردانی کاربر حذف شده
  async restore(id: number): Promise<IUser | null> {
    const db = this.getDb();
    
    const result = await db
      .update(users)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    if (result.length === 0) return null;
    return this.mapToIUser(result[0] as typeof users.$inferSelect);
  }

  // بررسی وجود شماره تلفن
  async isPhoneNumberExists(phoneNumber: string, excludeId?: number): Promise<boolean> {
    const db = this.getDb();
    
    let query = db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber));

    if (excludeId) {
      query = query.where(sql`${users.id} != ${excludeId}`);
    }

    const result = await query;
    return result.length > 0;
  }

  // آمار کاربران
  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    averageAge: number;
    averageHeight: number;
    averageWeight: number;
    experienceDistribution: Record<string, number>;
  }> {
    const db = this.getDb();

    // تعداد کل کاربران
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    // کاربران فعال
    const activeResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.isActive, true));

    // کاربران غیرفعال
    const inactiveResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.isActive, false));

    // میانگین‌ها
    const averagesResult = await db
      .select({
        avgAge: sql<number>`avg(${users.age})`,
        avgHeight: sql<number>`avg(${users.height})`,
        avgWeight: sql<number>`avg(${users.weight})`,
      })
      .from(users)
      .where(eq(users.isActive, true));

    // توزیع تجربه
    const experienceResult = await db
      .select({
        experience: users.trainingExperience,
        count: sql<number>`count(*)`,
      })
      .from(users)
      .where(eq(users.isActive, true))
      .groupBy(users.trainingExperience);

    const experienceDistribution: Record<string, number> = {};
    experienceResult.forEach(row => {
      experienceDistribution[row.experience] = Number(row.count);
    });

    return {
      totalUsers: totalResult[0].count,
      activeUsers: activeResult[0].count,
      inactiveUsers: inactiveResult[0].count,
      averageAge: Math.round(averagesResult[0].avgAge ?? 0 ),
      averageHeight: Math.round(averagesResult[0].avgHeight ?? 0),
      averageWeight: Math.round(averagesResult[0].avgWeight ?? 0),
      experienceDistribution,
    };
  }
} 