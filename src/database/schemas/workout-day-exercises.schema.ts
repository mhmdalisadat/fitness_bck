import { pgTable, serial, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { exercises } from './exercises.schema';
import { workoutDays } from './workout-days.schema';

// Workout day exercises (junction table)
export const workoutDayExercises = pgTable('workout_day_exercises', {
  id: serial('id').primaryKey(),
  workoutDayId: integer('workout_day_id').references(() => workoutDays.id),
  exerciseId: integer('exercise_id').references(() => exercises.id),
  sets: integer('sets'),
  reps: integer('reps'),
  duration: integer('duration'), // in seconds
  restTime: integer('rest_time'), // in seconds
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const workoutDayExercisesRelations = relations(workoutDayExercises, ({ one }) => ({
  workoutDay: one('workoutDays', {
    fields: [workoutDayExercises.workoutDayId],
    references: ['workoutDays.id'],
  }),
  exercise: one('exercises', {
    fields: [workoutDayExercises.exerciseId],
    references: ['exercises.id'],
  }),
})); 