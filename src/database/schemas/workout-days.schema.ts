import { pgTable, serial, timestamp, integer, json, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workouts } from './workouts.schema';

// Workout days
export const workoutDays = pgTable('workout_days', {
  id: serial('id').primaryKey(),
  dayNumber: integer('day_number').notNull(),
  dayMuscleGroups: json('day_muscle_groups'), 
  dayWorkoutId: integer('day_workout_id').references(() => workouts.id).notNull(),
  dayMovements: json('day_movements'),
  dayIsActive: boolean('day_is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const workoutDaysRelations = relations(workoutDays, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [workoutDays.dayWorkoutId],
    references: [workouts.id],
  }),
  movements: many('movements' as any),
})); 