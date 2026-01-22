import { eq } from 'drizzle-orm';

import { users } from '../schema/schema';
import type { DbExecutor } from '../types';

export const getUsers = async (db: DbExecutor) => {
  const data = await db.select().from(users);
  return data;
};

export const getUserByEmail = async (email: string, db: DbExecutor) => {
  const [data] = await db.select().from(users).where(eq(users.email, email));
  return data;
};
