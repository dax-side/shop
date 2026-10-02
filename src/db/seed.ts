import { existsSync } from "node:fs";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { products } from "./schema";
import { seedProducts } from "./seed-data";

if (!process.env.DATABASE_URL && existsSync(".env.local")) process.loadEnvFile(".env.local");

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

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
