import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();

export default defineConfig({
  out: './src/migrations',
  schema: './src/schema.ts',
  dialect: 'postgresql',
  migrations: {
    table: 'ginza_migrations',
  },
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
