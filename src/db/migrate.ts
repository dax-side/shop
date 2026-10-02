import { existsSync } from "node:fs";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

if (!process.env.DATABASE_URL && existsSync(".env.local")) process.loadEnvFile(".env.local");

// Applies pending migrations from ./drizzle. Runs on every Vercel build.
async function main() {
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("⚠ DATABASE_URL is not set; skipping migrations. Connect Neon in Vercel → Storage.");
    return;
  }

  const pool = new Pool({ connectionString });
  await migrate(drizzle(pool), { migrationsFolder: "drizzle" });
  console.log("Migrations applied.");
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
