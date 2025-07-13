import { pgTable, serial, text, timestamp, integer, boolean, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.schema';

// Workout categories
export const workoutCategories = pgTable('workout_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Workouts table
export const workouts = pgTable('workouts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  categoryId: integer('category_id').references(() => workoutCategories.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  duration: integer('duration'), // in minutes
  difficulty: varchar('difficulty', { length: 20 }), // beginner, intermediate, advanced
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  user: one('users', {
    fields: [workouts.userId],
    references: ['users.id'],
  }),
  category: one(workoutCategories, {
    fields: [workouts.categoryId],
    references: [workoutCategories.id],
  }),
  days: many('workoutDays'),
  progress: many('userWorkoutProgress'),
})); 