import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';

export interface CreateUserDto {
  name: string;
  phone: string;
}

export interface UpdateUserDto {
  name?: string;
  phone?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const result = await this.databaseService.getDb()
      .insert(users)
      .values(createUserDto)
      .returning();
    return result[0];
  }

  async findAll() {
    return await this.databaseService.getDb().select().from(users);
  }

  async findOne(id: number) {
    const result = await this.databaseService.getDb()
      .select()
      .from(users)
      .where(eq(users.id, id));
    return result[0];
  }

  async findByPhone(phone: string) {
    const result = await this.databaseService.getDb()
      .select()
      .from(users)
      .where(eq(users.phone, phone));
    return result[0];
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const result = await this.databaseService.getDb()
      .update(users)
      .set({ ...updateUserDto, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async remove(id: number) {
    const result = await this.databaseService.getDb()
      .delete(users)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }
}
