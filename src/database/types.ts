import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

export type DrizzleDatabase = ReturnType<typeof drizzle<typeof schema>>; 