import type { drizzle } from 'drizzle-orm/postgres-js';
import type * as schema from './schema';

export type IDrizzleDatabase = ReturnType<typeof drizzle<typeof schema>>; 