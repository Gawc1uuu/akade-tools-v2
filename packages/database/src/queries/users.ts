import { users } from '../schema/schema';
import type { DbExecutor } from '../types';

export const getUsers = async (db: DbExecutor) => {
  const data = await db.select().from(users);
  return data;
};
