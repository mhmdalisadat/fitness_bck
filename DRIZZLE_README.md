# راهنمای استفاده از Drizzle ORM

## نصب و پیکربندی

پروژه شما قبلاً با Drizzle ORM پیکربندی شده است. در ادامه نحوه استفاده از آن را توضیح می‌دهیم.

## متغیرهای محیطی

ابتدا فایل `.env` را در ریشه پروژه ایجاد کنید:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/fitness_db
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

## دستورات Drizzle

### تولید migration
```bash
npm run db:generate
```

### اعمال migration
```bash
npm run db:migrate
```

### push کردن schema به دیتابیس (برای development)
```bash
npm run db:push
```

### باز کردن Drizzle Studio
```bash
npm run db:studio
```

## ساختار دیتابیس

### جداول موجود:
- `users` - کاربران
- `workout_categories` - دسته‌بندی‌های تمرین
- `workouts` - تمرینات
- `workout_days` - روزهای تمرین
- `exercises` - حرکات ورزشی
- `workout_day_exercises` - ارتباط روز تمرین و حرکات
- `user_workout_progress` - پیشرفت کاربران

## نحوه استفاده در سرویس‌ها

```typescript
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class MyService {
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
}
```

## Query Examples

### Select با Relations
```typescript
const result = await db
  .select()
  .from(workouts)
  .leftJoin(users, eq(workouts.userId, users.id))
  .leftJoin(workoutCategories, eq(workouts.categoryId, workoutCategories.id));
```

### Insert
```typescript
const newUser = await db.insert(users).values({
  email: 'user@example.com',
  password: 'hashedPassword',
  firstName: 'John',
  lastName: 'Doe'
}).returning();
```

### Update
```typescript
const updatedUser = await db
  .update(users)
  .set({ firstName: 'Jane' })
  .where(eq(users.id, 1))
  .returning();
```

### Delete
```typescript
const deletedUser = await db
  .delete(users)
  .where(eq(users.id, 1))
  .returning();
```

## نکات مهم

1. همیشه از `DatabaseService` برای دسترسی به دیتابیس استفاده کنید
2. برای queries پیچیده از `leftJoin` استفاده کنید
3. از `returning()` برای دریافت نتیجه عملیات insert/update/delete استفاده کنید
4. برای development از `db:push` و برای production از `db:migrate` استفاده کنید 