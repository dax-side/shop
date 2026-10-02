import { existsSync } from "node:fs";
import { count, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { products } from "./schema";
import { seedProducts } from "./seed-data";

if (!process.env.DATABASE_URL && existsSync(".env.local")) process.loadEnvFile(".env.local");

// --if-empty only seeds a fresh database, so deploys never overwrite catalogue edits.
const ifEmpty = process.argv.includes("--if-empty");

async function main() {
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("⚠ DATABASE_URL is not set; skipping seed.");
    return;
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  if (ifEmpty) {
    const [{ total }] = await db.select({ total: count() }).from(products);
    if (total > 0) {
      console.log(`Catalogue already has ${total} products; skipping seed.`);
      await pool.end();
      return;
    }
  }

  await db
    .insert(products)
    .values(seedProducts)
    .onConflictDoUpdate({
      target: products.slug,
      set: {
        number: sql`excluded.number`,
        name: sql`excluded.name`,
        room: sql`excluded.room`,
        material: sql`excluded.material`,
        tagline: sql`excluded.tagline`,
        description: sql`excluded.description`,
        price: sql`excluded.price`,
        isNew: sql`excluded.is_new`,
        tone: sql`excluded.tone`,
        finishes: sql`excluded.finishes`,
        details: sql`excluded.details`,
      },
    });

  console.log(`Seeded ${seedProducts.length} products.`);
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
