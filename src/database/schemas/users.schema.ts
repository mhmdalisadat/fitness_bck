import { pgTable, serial, timestamp, boolean, varchar, integer, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { TRAINING_EXPERIENCE_LEVELS, TRAINING_GOALS, MEDICAL_CONDITIONS, INJURIES } from '../../constants/enums';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  age: integer('age').notNull(),
  height: integer('height').notNull(), // in centimeters
  weight: integer('weight').notNull(), // in kilograms
  trainingExperience: varchar('training_experience', { length: 20 }).notNull(), // enum: TRAINING_EXPERIENCE_LEVELS
  trainingGoals: text('training_goals'), // JSON array of TRAINING_GOALS
  medicalConditions: text('medical_conditions'), // JSON array of MEDICAL_CONDITIONS
  injuries: text('injuries'), // JSON array of INJURIES
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  workouts: many('workouts'),
  progress: many('userWorkoutProgress'),
})); 