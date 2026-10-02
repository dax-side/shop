import "server-only";
import { and, asc, eq, inArray } from "drizzle-orm";
import { connection } from "next/server";
import { getDb, schema } from "@/db";
import type { Product, RoomSlug } from "./catalogue";

const { products } = schema;

const columns = {
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
};

export async function getProducts(room?: RoomSlug): Promise<Product[]> {
  await connection();
  return getDb()
    .select(columns)
    .from(products)
    .where(and(eq(products.active, true), room ? eq(products.room, room) : undefined))
    .orderBy(asc(products.id));
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  await connection();
  const [product] = await getDb()
    .select(columns)
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.active, true)))
    .limit(1);
  return product;
}

// For pricing an order: includes the internal id needed for order lines.
export async function getProductsForOrder(slugs: string[]) {
  if (slugs.length === 0) return [];
  return getDb()
    .select({ id: products.id, ...columns })
    .from(products)
    .where(and(inArray(products.slug, slugs), eq(products.active, true)));
}
