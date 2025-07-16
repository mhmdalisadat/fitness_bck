import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersRepository, IUserFilters, IPaginationOptions } from '../database/repositories/users.repository';
import { ICreateUserInput, IUpdateUserInput, IUser } from '../types/users.type';
import { validateUserData } from '../database/validations/users.validations';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(userData: ICreateUserInput): Promise<IUser> {
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
    const existingUser = await this.usersRepository.findByPhoneNumber(userData.phoneNumber);
    if (existingUser) {
      throw new HttpException(
        {
          success: false,
          message: "کاربر با این شماره تماس قبلاً ثبت شده است",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // ایجاد کاربر جدید
    return await this.usersRepository.create(userData);
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
    const user = await this.usersRepository.findByPhoneNumber(phoneNumber);
    if (!user) {
      throw new HttpException(
        {
          success: false,
          message: "کاربر مورد نظر یافت نشد",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // TODO: جستجوی برنامه‌های تمرینی کاربر - این بخش نیاز به repository جداگانه دارد
    const workouts: Array<{
      workoutName: string;
      workoutDescription: string;
      workoutDifficulty: string;
      workoutDaysPerWeek: number;
      workoutDuration: number;
      workoutDurationUnit: string;
      workoutRating: string | null;
      workoutNumberOfRatings: number | null;
      workoutIsActive: boolean | null;
    }> = [];

    return {
      user,
      workouts,
    };
  }

  async findAllWithPagination(filters?: IUserFilters, pagination?: IPaginationOptions) {
    return await this.usersRepository.findAll(filters, pagination);
  }

  async findAll(): Promise<IUser[]> {
    const result = await this.usersRepository.findAll();
    return result.users;
  }

  async findById(id: number): Promise<IUser | null> {
    return await this.usersRepository.findById(id);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<IUser | null> {
    return await this.usersRepository.findByPhoneNumber(phoneNumber);
  }

  async updateUser(id: number, userData: IUpdateUserInput): Promise<IUser> {
    // بررسی وجود کاربر
    const existingUser = await this.usersRepository.findById(id);
    if (!existingUser) {
      throw new HttpException(
        {
          success: false,
          message: "کاربر مورد نظر یافت نشد",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // بررسی تکراری نبودن شماره تماس (اگر تغییر کرده باشد)
    if (userData.phoneNumber && userData.phoneNumber !== existingUser.phoneNumber) {
      const phoneExists = await this.usersRepository.isPhoneNumberExists(userData.phoneNumber, id);
      if (phoneExists) {
        throw new HttpException(
          {
            success: false,
            message: "شماره تماس جدید قبلاً توسط کاربر دیگری استفاده شده است",
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // اعتبارسنجی داده‌ها (اگر ارسال شده باشند)
    if (Object.keys(userData).length > 0) {
      const validationData = { ...existingUser, ...userData };
      const validation = validateUserData(validationData);
      if (!validation.isValid) {
        throw new HttpException(
          {
            success: false,
            message: "داده‌های ارسالی نامعتبر هستند",
            errors: validation.errors,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const updatedUser = await this.usersRepository.update(id, userData);
    if (!updatedUser) {
      throw new HttpException(
        {
          success: false,
          message: "خطا در بروزرسانی کاربر",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return updatedUser;
  }

  async softDeleteUser(id: number): Promise<IUser> {
    const deletedUser = await this.usersRepository.softDelete(id);
    if (!deletedUser) {
      throw new HttpException(
        {
          success: false,
          message: "کاربر مورد نظر یافت نشد",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return deletedUser;
  }

  async hardDeleteUser(id: number): Promise<IUser> {
    const deletedUser = await this.usersRepository.hardDelete(id);
    if (!deletedUser) {
      throw new HttpException(
        {
          success: false,
          message: "کاربر مورد نظر یافت نشد",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return deletedUser;
  }

  async restoreUser(id: number): Promise<IUser> {
    const restoredUser = await this.usersRepository.restore(id);
    if (!restoredUser) {
      throw new HttpException(
        {
          success: false,
          message: "کاربر مورد نظر یافت نشد",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return restoredUser;
  }

  async getUserStats() {
    return await this.usersRepository.getUserStats();
  }

  // متدهای موجود برای سازگاری
  async update(id: number, userData: Partial<IUpdateUserInput>): Promise<IUser | undefined> {
    const user = await this.updateUser(id, userData);
    return user;
  }

  async delete(id: number): Promise<IUser | undefined> {
    const user = await this.softDeleteUser(id);
    return user;
  }
} 