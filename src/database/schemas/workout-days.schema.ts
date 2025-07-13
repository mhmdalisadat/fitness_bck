import { pgTable, serial, text, timestamp, integer, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workouts } from './workouts.schema';

// Workout days
export const workoutDays = pgTable('workout_days', {
  id: serial('id').primaryKey(),
  workoutId: integer('workout_id').references(() => workouts.id),
  dayNumber: integer('day_number').notNull(),
  name: varchar('name', { length: 255 }),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const workoutDaysRelations = relations(workoutDays, ({ one, many }) => ({
  workout: one('workouts', {
    fields: [workoutDays.workoutId],
    references: ['workouts.id'],
  }),
  exercises: many('workoutDayExercises'),
  progress: many('userWorkoutProgress'),
})); 