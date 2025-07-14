import { pgTable, serial, text, timestamp, integer, varchar, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Workouts table
export const workouts = pgTable('workouts', {
  id: serial('id').primaryKey(),
  workoutId: uuid('workout_id').defaultRandom().notNull().unique(),
  workoutName: varchar('workout_name', { length: 255 }).notNull().unique(),
  workoutDescription: text('workout_description').notNull(),
  workoutDaysPerWeek: integer('workout_days_per_week').notNull(),
  workoutWeeks: integer('workout_weeks').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const workoutsRelations = relations(workouts, ({ many }) => ({
  days: many('workoutDays' as any),
})); 