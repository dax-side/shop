import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import type { Product } from "./catalogue";

const { products, savedItems } = schema;

// Saved products for the user, most recently saved first.
export async function getSavedProducts(userId: string): Promise<Product[]> {
  return getDb()
    .select({
      slug: products.slug,
      number: products.number,
      name: products.name,
      room: products.room,
      material: products.material,
      tagline: products.tagline,
      description: products.description,
      price: products.price,
      isNew: products.isNew,
      tone: products.tone,
      finishes: products.finishes,
      details: products.details,
    })
    .from(savedItems)
    .innerJoin(products, eq(products.id, savedItems.productId))
    .where(and(eq(savedItems.userId, userId), eq(products.active, true)))
    .orderBy(desc(savedItems.createdAt));
}

async function productId(slug: string) {
  const [product] = await getDb()
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.active, true)))
    .limit(1);
  return product?.id;
}

// Returns false when there is no such product.
export async function setSaved(userId: string, slug: string, saved: boolean) {
  const id = await productId(slug);
  if (!id) return false;
  if (saved) {
    await getDb().insert(savedItems).values({ userId, productId: id }).onConflictDoNothing();
  } else {
    await getDb().delete(savedItems).where(and(eq(savedItems.userId, userId), eq(savedItems.productId, id)));
  }
  return true;
}
