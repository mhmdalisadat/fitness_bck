import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type { users } from '../../database/schemas/users.schema';

export type IUser = InferSelectModel<typeof users>;
export type INewUser = InferInsertModel<typeof users>;

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResponse {
  user: {
    id: number;
    phoneNumber: string;
    name: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}