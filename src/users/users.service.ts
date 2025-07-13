import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    const db = this.databaseService.getDb();
    return await db.select().from(users);
  }

  async findById(id: number) {
    const db = this.databaseService.getDb();
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async findByEmail(email: string) {
    const db = this.databaseService.getDb();
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async create(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    const db = this.databaseService.getDb();
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  async update(id: number, userData: Partial<typeof users.$inferInsert>) {
    const db = this.databaseService.getDb();
    const result = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const db = this.databaseService.getDb();
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result[0];
  }
} 