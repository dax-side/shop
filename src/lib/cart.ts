import "server-only";
import { and, asc, eq, sql } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { MAX_QUANTITY } from "./bag-store";
import { productImages } from "./product-images";

type Db = ReturnType<typeof getDb>;
type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

export type Client = "web" | "app";

export type CartLine = { slug: string; finish?: string; quantity: number };

export class CartError extends Error {}

const clamp = (quantity: number) => Math.min(Math.max(Math.floor(quantity), 1), MAX_QUANTITY);

// Raises the cart's version so waiting clients know something changed.
async function bump(tx: Tx, userId: string) {
  const [row] = await tx
    .insert(schema.carts)
    .values({ userId, version: 1 })
    .onConflictDoUpdate({
      target: schema.carts.userId,
      set: { version: sql`${schema.carts.version} + 1`, updatedAt: new Date() },
    })
    .returning({ version: schema.carts.version });
  return row.version;
}

// Looks up an active product and checks the finish, defaulting to the first one.
async function resolve(tx: Tx | Db, slug: string, finish?: string) {
  const [product] = await tx
    .select({ id: schema.products.id, finishes: schema.products.finishes })
    .from(schema.products)
    .where(and(eq(schema.products.slug, slug), eq(schema.products.active, true)))
    .limit(1);
  if (!product) throw new CartError("That product isn't available.");

  if (product.finishes.length === 0) return { productId: product.id, finish: "" };
  const chosen = finish ?? product.finishes[0].name;
  if (!product.finishes.some((f) => f.name === chosen)) throw new CartError("Choose one of the listed finishes.");
  return { productId: product.id, finish: chosen };
}

export async function getCartVersion(userId: string) {
  const [row] = await getDb()
    .select({ version: schema.carts.version })
    .from(schema.carts)
    .where(eq(schema.carts.userId, userId))
    .limit(1);
  return row?.version ?? 0;
}

export async function getCart(userId: string, origin: string) {
  const db = getDb();
  const [version, rows] = await Promise.all([
    getCartVersion(userId),
    db
      .select({
        slug: schema.products.slug,
        number: schema.products.number,
        name: schema.products.name,
        material: schema.products.material,
        price: schema.products.price,
        tone: schema.products.tone,
        finish: schema.cartItems.finish,
        quantity: schema.cartItems.quantity,
        addedFrom: schema.cartItems.addedFrom,
        addedAt: schema.cartItems.addedAt,
      })
      .from(schema.cartItems)
      .innerJoin(schema.products, eq(schema.products.id, schema.cartItems.productId))
      .where(and(eq(schema.cartItems.userId, userId), eq(schema.products.active, true)))
      .orderBy(asc(schema.cartItems.id)),
  ]);

  const items = rows.map((row) => {
    const image = productImages(row.slug)[0];
    return {
      ...row,
      finish: row.finish || undefined,
      lineTotal: row.price * row.quantity,
      image: image
        ? `${origin}/_next/image?${new URLSearchParams({ url: image.src, w: "640", q: "75" })}`
        : null,
      addedAt: row.addedAt.toISOString(),
    };
  });

  return {
    version,
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
  };
}

export type Cart = Awaited<ReturnType<typeof getCart>>;

// Adds to the quantity already in the bag (or creates the line).
export async function addToCart(userId: string, lines: CartLine[], client: Client) {
  await getDb().transaction(async (tx) => {
    for (const line of lines) {
      const { productId, finish } = await resolve(tx, line.slug, line.finish);
      await tx
        .insert(schema.cartItems)
        .values({ userId, productId, finish, quantity: clamp(line.quantity), addedFrom: client })
        .onConflictDoUpdate({
          target: [schema.cartItems.userId, schema.cartItems.productId, schema.cartItems.finish],
          set: {
            quantity: sql`least(${schema.cartItems.quantity} + excluded.quantity, ${MAX_QUANTITY})`,
            addedFrom: client,
            addedAt: new Date(),
          },
        });
    }
    await bump(tx, userId);
  });
}

export async function setCartQuantity(userId: string, line: CartLine) {
  await getDb().transaction(async (tx) => {
    const { productId, finish } = await resolve(tx, line.slug, line.finish);
    await tx
      .update(schema.cartItems)
      .set({ quantity: clamp(line.quantity) })
      .where(
        and(
          eq(schema.cartItems.userId, userId),
          eq(schema.cartItems.productId, productId),
          eq(schema.cartItems.finish, finish),
        ),
      );
    await bump(tx, userId);
  });
}

export async function removeFromCart(userId: string, slug: string, finish?: string) {
  await getDb().transaction(async (tx) => {
    const { productId, finish: resolved } = await resolve(tx, slug, finish);
    await tx
      .delete(schema.cartItems)
      .where(
        and(
          eq(schema.cartItems.userId, userId),
          eq(schema.cartItems.productId, productId),
          eq(schema.cartItems.finish, resolved),
        ),
      );
    await bump(tx, userId);
  });
}

export async function clearCart(userId: string) {
  await getDb().transaction(async (tx) => {
    await tx.delete(schema.cartItems).where(eq(schema.cartItems.userId, userId));
    await bump(tx, userId);
  });
}
