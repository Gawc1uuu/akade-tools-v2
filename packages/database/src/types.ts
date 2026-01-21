import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import * as schema from './schema/schema';

export type DatabaseType = PostgresJsDatabase<typeof schema>;
export type TransactionType = Parameters<Parameters<DatabaseType['transaction']>[0]>[0];

export type DbExecutor = DatabaseType | TransactionType;
