ALTER TABLE "exercises" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_workout_progress" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "workout_categories" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "workout_day_exercises" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "workout_days" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "workouts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "exercises" CASCADE;--> statement-breakpoint
DROP TABLE "user_workout_progress" CASCADE;--> statement-breakpoint
DROP TABLE "workout_categories" CASCADE;--> statement-breakpoint
DROP TABLE "workout_day_exercises" CASCADE;--> statement-breakpoint
DROP TABLE "workout_days" CASCADE;--> statement-breakpoint
DROP TABLE "workouts" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "first_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "last_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_phone_unique" UNIQUE("phone");