import { pgTable, serial, timestamp, boolean, varchar, integer, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workouts } from './workouts.schema';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  age: integer('age').notNull(),
  height: integer('height').notNull(), 
  weight: integer('weight').notNull(), 
  trainingExperience: varchar('training_experience', { length: 20 }).notNull(), 
  trainingGoals: text('training_goals'), 
  medicalConditions: text('medical_conditions'), 
  injuries: text('injuries'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  workouts: many(workouts),
})); 