import { pgTable, serial, text, timestamp, integer, varchar, uuid, boolean, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Workouts table
export const workouts = pgTable('workouts', {
  id: serial('id').primaryKey(),
  workoutId: uuid('workout_id').defaultRandom().notNull().unique(),
  workoutName: varchar('workout_name', { length: 255 }).notNull(),
  workoutDescription: text('workout_description').notNull(),
  workoutDifficulty: varchar('workout_difficulty', { length: 50 }).notNull(),
  workoutDaysPerWeek: integer('workout_days_per_week').notNull(),
  workoutDuration: integer('workout_duration').notNull(),
  workoutDurationUnit: varchar('workout_duration_unit', { length: 20 }).notNull(),
  workoutRating: decimal('workout_rating', { precision: 3, scale: 2 }).default('0.00'),
  workoutNumberOfRatings: integer('workout_number_of_ratings').default(0),
  workoutIsActive: boolean('workout_is_active').default(true),
  workoutCreatedBy: varchar('workout_created_by', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const workoutsRelations = relations(workouts, ({ many }) => ({
  days: many('workoutDays' as any),
})); 