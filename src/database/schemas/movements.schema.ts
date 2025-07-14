import { pgTable, serial, text, timestamp, integer, boolean, varchar, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { MUSCLE_GROUPS, DIFFICULTY_LEVELS, EQUIPMENT_TYPES, MOVEMENT_TYPES, SET_TYPES } from '../../constants/enums';
import { workouts } from './workouts.schema';
import { workoutDays } from './workout-days.schema';

// Movements table
export const movements = pgTable('movements', {
  id: serial('id').primaryKey(),
  
  // Basic Information
  name: varchar('name', { length: 255 }).notNull(),
  nameEn: varchar('name_en', { length: 255 }),
  description: text('description').notNull(),
  type: varchar('type', { length: 20 }).notNull(), // enum: MOVEMENT_TYPES
  muscleGroup: varchar('muscle_group', { length: 20 }).notNull(), // enum: MUSCLE_GROUPS
  difficulty: varchar('difficulty', { length: 20 }).notNull(), // enum: DIFFICULTY_LEVELS
  
  // Media
  videoUrl: text('video_url'),
  imageUrl: text('image_url'),
  
  // Relationships
  workoutId: integer('workout_id').references(() => workouts.id),
  dayId: integer('day_id').references(() => workoutDays.id),
  order: integer('order').notNull(),
  
  // Equipment and Configuration
  equipment: json('equipment'), // JSON array of EQUIPMENT_TYPES
  setTypes: json('set_types'), // JSON array of set type configurations
  
  // Exercise Parameters
  sets: integer('sets').notNull(),
  reps: integer('reps').notNull(),
  restTime: integer('rest_time').notNull(), // in seconds
  tempo: varchar('tempo', { length: 20 }).notNull().default('3-1-1-1'),
  weight: integer('weight').notNull(),
  weightUnit: varchar('weight_unit', { length: 5 }).notNull().default('kg'), // kg or lb
  
  // Status
  isActive: boolean('is_active').default(true),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const movementsRelations = relations(movements, ({ one }) => ({
  workout: one(workouts, {
    fields: [movements.workoutId],
    references: [workouts.id],
  }),
  day: one(workoutDays, {
    fields: [movements.dayId],
    references: [workoutDays.id],
  }),
})); 