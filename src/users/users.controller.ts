import { 
  Controller, 
  Get, 
  Post, 
  Put,
  Delete,
  Body, 
  Param, 
  Query,
  HttpStatus, 
  HttpException,
  HttpCode, 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { IUserFilters, IPaginationOptions } from '../database/repositories/users.repository';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userData: CreateUserDto) {
    try {
      const result = await this.usersService.createUser(userData);
      
      return {
        success: true,
        message: "کاربر با موفقیت ایجاد شد",
        data: {
          user: {
            id: result.id,
            phoneNumber: result.phoneNumber,
            name: result.name,
            age: result.age,
            height: result.height,
            weight: result.weight,
            trainingExperience: result.trainingExperience,
            trainingGoals: result.trainingGoals,
            medicalConditions: result.medicalConditions,
            injuries: result.injuries,
            bmi: (result.weight / Math.pow(result.height / 100, 2)).toFixed(1),
            isActive: result.isActive,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
          },
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: "خطا در ایجاد کاربر",
          error: error instanceof Error ? error.message : "خطای ناشناخته",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':phoneNumber')
  @HttpCode(HttpStatus.OK)
  async getUserInfo(@Param('phoneNumber') phoneNumber: string) {
    try {
      const result = await this.usersService.getUserInfo(phoneNumber);
      
      return {
        success: true,
        message: "اطلاعات کاربر با موفقیت دریافت شد",
        data: {
          user: {
            id: result.user.id,
            phoneNumber: result.user.phoneNumber,
            name: result.user.name,
            age: result.user.age,
            height: result.user.height,
            weight: result.user.weight,
            trainingExperience: result.user.trainingExperience,
            trainingGoals: result.user.trainingGoals,
            medicalConditions: result.user.medicalConditions,
            injuries: result.user.injuries,
            bmi: (result.user.weight / Math.pow(result.user.height / 100, 2)).toFixed(1),
            isActive: result.user.isActive,
            createdAt: result.user.createdAt,
            updatedAt: result.user.updatedAt,
          },
          workouts: result.workouts,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: "خطا در دریافت اطلاعات کاربر",
          error: error instanceof Error ? error.message : "خطای ناشناخته",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('isActive') isActive?: string,
    @Query('trainingExperience') trainingExperience?: string,
    @Query('ageMin') ageMin?: string,
    @Query('ageMax') ageMax?: string,
    @Query('search') search?: string,
  ) {
    try {
      const filters: IUserFilters = {};
      const pagination: IPaginationOptions = {};

      // Parse filters
      if (isActive !== undefined) {
        filters.isActive = isActive === 'true';
      }
      if (trainingExperience) {
        filters.trainingExperience = trainingExperience;
      }
      if (ageMin) {
        filters.ageMin = parseInt(ageMin, 10);
      }
      if (ageMax) {
        filters.ageMax = parseInt(ageMax, 10);
      }
      if (search) {
        filters.search = search;
      }

      // Parse pagination
      if (page) {
        pagination.page = parseInt(page, 10);
      }
      if (limit) {
        pagination.limit = parseInt(limit, 10);
      }

      const result = await this.usersService.findAllWithPagination(filters, pagination);

      return {
        success: true,
        message: "لیست کاربران با موفقیت دریافت شد",
        data: {
          users: result.users.map(user => ({
            id: user.id,
            phoneNumber: user.phoneNumber,
            name: user.name,
            age: user.age,
            height: user.height,
            weight: user.weight,
            trainingExperience: user.trainingExperience,
            trainingGoals: user.trainingGoals,
            medicalConditions: user.medicalConditions,
            injuries: user.injuries,
            bmi: (user.weight / Math.pow(user.height / 100, 2)).toFixed(1),
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          })),
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
          },
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: "خطا در دریافت لیست کاربران",
          error: error instanceof Error ? error.message : "خطای ناشناخته",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: string) {
    try {
      const userId = parseInt(id, 10);
      const user = await this.usersService.findById(userId);

      if (!user) {
        throw new HttpException(
          {
            success: false,
            message: "کاربر مورد نظر یافت نشد",
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: "اطلاعات کاربر با موفقیت دریافت شد",
        data: {
          user: {
            id: user.id,
            phoneNumber: user.phoneNumber,
            name: user.name,
            age: user.age,
            height: user.height,
            weight: user.weight,
            trainingExperience: user.trainingExperience,
            trainingGoals: user.trainingGoals,
            medicalConditions: user.medicalConditions,
            injuries: user.injuries,
            bmi: (user.weight / Math.pow(user.height / 100, 2)).toFixed(1),
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: "خطا در دریافت اطلاعات کاربر",
          error: error instanceof Error ? error.message : "خطای ناشناخته",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    try {
      const userId = parseInt(id, 10);
      const result = await this.usersService.updateUser(userId, userData);

      return {
        success: true,
        message: "کاربر با موفقیت بروزرسانی شد",
        data: {
          user: {
            id: result.id,
            phoneNumber: result.phoneNumber,
            name: result.name,
            age: result.age,
            height: result.height,
            weight: result.weight,
            trainingExperience: result.trainingExperience,
            trainingGoals: result.trainingGoals,
            medicalConditions: result.medicalConditions,
            injuries: result.injuries,
            bmi: (result.weight / Math.pow(result.height / 100, 2)).toFixed(1),
            isActive: result.isActive,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
          },
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: "خطا در بروزرسانی کاربر",
          error: error instanceof Error ? error.message : "خطای ناشناخته",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async softDeleteUser(@Param('id') id: string) {
    try {
      const userId = parseInt(id, 10);
      const result = await this.usersService.softDeleteUser(userId);

      return {
        success: true,
        message: "کاربر با موفقیت حذف شد",
        data: {
          user: {
            id: result.id,
            phoneNumber: result.phoneNumber,
            name: result.name,
            isActive: result.isActive,
            updatedAt: result.updatedAt,
          },
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: "خطا در حذف کاربر",
          error: error instanceof Error ? error.message : "خطای ناشناخته",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('hard/:id')
  @HttpCode(HttpStatus.OK)
  async hardDeleteUser(@Param('id') id: string) {
    try {
      const userId = parseInt(id, 10);
      const result = await this.usersService.hardDeleteUser(userId);

      return {
        success: true,
        message: "کاربر با موفقیت حذف شد",
        data: {
          user: {
            id: result.id,
            phoneNumber: result.phoneNumber,
            name: result.name,
          },
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: "خطا در حذف کاربر",
          error: error instanceof Error ? error.message : "خطای ناشناخته",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('restore/:id')
  @HttpCode(HttpStatus.OK)
  async restoreUser(@Param('id') id: string) {
    try {
      const userId = parseInt(id, 10);
      const result = await this.usersService.restoreUser(userId);

      return {
        success: true,
        message: "کاربر با موفقیت بازگردانی شد",
        data: {
          user: {
            id: result.id,
            phoneNumber: result.phoneNumber,
            name: result.name,
            isActive: result.isActive,
            updatedAt: result.updatedAt,
          },
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: "خطا در بازگردانی کاربر",
          error: error instanceof Error ? error.message : "خطای ناشناخته",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats/overview')
  @HttpCode(HttpStatus.OK)
  async getUserStats() {
    try {
      const stats = await this.usersService.getUserStats();

      return {
        success: true,
        message: "آمار کاربران با موفقیت دریافت شد",
        data: {
          stats,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: "خطا در دریافت آمار کاربران",
          error: error instanceof Error ? error.message : "خطای ناشناخته",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 