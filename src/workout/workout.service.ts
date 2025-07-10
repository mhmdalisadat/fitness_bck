import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // فرض بر این است که سرویس Prisma دارید
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkoutService {
  constructor(private prisma: PrismaService) {}

  async createProgram(data: Prisma.ProgramCreateInput) {
    return this.prisma.program.create({ data });
  }

  async getProgramByUserId(userId: string) {
    return this.prisma.program.findMany({ where: { userId } });
  }
}