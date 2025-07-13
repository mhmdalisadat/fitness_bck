import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Exercises table
export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  muscleGroup: varchar('muscle_group', { length: 100 }),
  equipment: varchar('equipment', { length: 100 }),
  difficulty: varchar('difficulty', { length: 20 }),
  instructions: text('instructions'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutDayExercises: many('workoutDayExercises'),
})); 