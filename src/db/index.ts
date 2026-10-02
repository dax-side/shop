import "server-only";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type Database = NodePgDatabase<typeof schema>;

// Reuse one pool across hot reloads in development.
const globalForDb = globalThis as unknown as { db?: Database };

function createDb(): Database {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local and add your Neon connection string.");
  }
  const pool = new Pool({ connectionString, max: 5 });
  return drizzle(pool, { schema });
}

export function getDb() {
  globalForDb.db ??= createDb();
  return globalForDb.db;
}

export { schema };
