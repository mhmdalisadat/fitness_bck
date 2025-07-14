import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  HttpStatus, 
  HttpException,
  HttpCode, 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

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
} 