import { existsSync } from "node:fs";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { products } from "./schema";
import { seedProducts } from "./seed-data";

if (!process.env.DATABASE_URL && existsSync(".env.local")) process.loadEnvFile(".env.local");

// --missing-only adds products that aren't in the database yet and leaves existing ones untouched,
// so deploys pick up new catalogue items without overwriting edits made in the database.
const missingOnly = process.argv.includes("--missing-only");

async function main() {
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("⚠ DATABASE_URL is not set; skipping seed.");
    return;
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  if (missingOnly) {
    const added = await db.insert(products).values(seedProducts).onConflictDoNothing({ target: products.slug }).returning();
    console.log(added.length ? `Added ${added.length} new products.` : "Catalogue up to date; nothing to add.");
    await pool.end();
    return;
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
