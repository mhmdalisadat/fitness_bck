import { Injectable, Inject } from '@nestjs/common';
import { DrizzleDatabase } from './types';

@Injectable()
export class DatabaseService {
  constructor(@Inject('DATABASE') private readonly db: DrizzleDatabase) {}

  getDb() {
    return this.db;
  }
} 