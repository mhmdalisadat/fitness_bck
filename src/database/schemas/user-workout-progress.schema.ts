import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workouts } from './workouts.schema';
import { users } from './users.schema';
import { workoutDays } from './workout-days.schema';


export const userWorkoutProgress = pgTable('user_workout_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  workoutId: integer('workout_id').references(() => workouts.id),
  workoutDayId: integer('workout_day_id').references(() => workoutDays.id),
  completedAt: timestamp('completed_at').defaultNow(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});


export const userWorkoutProgressRelations = relations(userWorkoutProgress, ({ one }) => ({
  user: one('users', {
    fields: [userWorkoutProgress.userId],
    references: ['users.id'],
  }),
  workout: one('workouts', {
    fields: [userWorkoutProgress.workoutId],
    references: ['workouts.id'],
  }),
  workoutDay: one('workoutDays', {
    fields: [userWorkoutProgress.workoutDayId],
    references: ['workoutDays.id'],
  }),
})); 