import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// جدول کاربران
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// جدول تمرینات
export const workouts = pgTable('workouts', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// جدول تمرینات
export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  workoutId: serial('workout_id').references(() => workouts.id),
  name: text('name').notNull(),
  sets: text('sets'),
  reps: text('reps'),
  weight: text('weight'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
