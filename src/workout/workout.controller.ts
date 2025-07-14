// ... existing code ...
import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { WorkoutService } from './workout.service';

@Controller('programs')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post()
  async createProgram(@Body() body: any) {
    const { userId, userName, programName, exercises } = body;
    if (!userId || !userName || !programName || !exercises) {
      throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
    }
    const program = await this.workoutService.createProgram({
      userId,
      userName,
      programName,
      exercises,
    });

    return { message: 'Program created', program };
  }

  @Get(':userId')
  async getProgramByUserId(@Param('userId') userId: string) {
    const programs = await this.workoutService.getProgramByUserId(userId);
    if (!programs || programs.length === 0) {
      throw new HttpException('No programs found for this user', HttpStatus.NOT_FOUND);
    }

    return programs;
  }
}
// ... existing code ...