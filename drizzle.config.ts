import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL && existsSync(".env.local")) process.loadEnvFile(".env.local");

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Migrations prefer Neon's direct connection when the Vercel integration provides it.
    url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "",
  },
});
