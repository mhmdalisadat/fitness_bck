import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findById(id);
  }

  @Post()
  async create(@Body() userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    return await this.usersService.create(userData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: {
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      isActive?: boolean;
    }
  ) {
    return await this.usersService.update(id, userData);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.delete(id);
  }
} 