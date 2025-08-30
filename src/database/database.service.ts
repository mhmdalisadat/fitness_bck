import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: any;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const connectionString = this.configService.get<string>('DATABASE_URL');
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    const client = postgres(connectionString);
    this.db = drizzle(client);
  }

  getDb() {
    return this.db;
  }
}
