import type { NextRequest } from "next/server";
import { z } from "zod";
import { lineSchema, withCart } from "@/lib/api/cart-route";
import { apiError, readJson } from "@/lib/api/http";
import { addToCart, removeFromCart, setCartQuantity } from "@/lib/cart";

const addSchema = z.union([lineSchema, z.object({ items: z.array(lineSchema).max(50) })]);
const setSchema = lineSchema.required({ quantity: true });

// POST /api/cart/items: add one line ({ slug, finish?, quantity? }) or several ({ items: [...] },
// used to merge a guest bag after sign-in). Quantities add to what's already in the bag.
export async function POST(request: NextRequest) {
  return withCart(request, async (user) => {
    const body = addSchema.safeParse(await readJson(request));
    if (!body.success) return apiError(400, "Send { slug, finish?, quantity? } or { items: [...] }.");
    const lines = "items" in body.data ? body.data.items : [body.data];
    if (lines.length) await addToCart(user.id, lines, user.client);
  });
}

// PATCH /api/cart/items: set a line's quantity.
export async function PATCH(request: NextRequest) {
  return withCart(request, async (user) => {
    const body = setSchema.safeParse(await readJson(request));
    if (!body.success) return apiError(400, "Send { slug, finish?, quantity }.");
    await setCartQuantity(user.id, body.data);
  });
}

// DELETE /api/cart/items?slug=…&finish=…: remove a line.
export async function DELETE(request: NextRequest) {
  return withCart(request, async (user) => {
    const slug = request.nextUrl.searchParams.get("slug");
    if (!slug) return apiError(400, "Pass ?slug=");
    await removeFromCart(user.id, slug, request.nextUrl.searchParams.get("finish") ?? undefined);
  });
}
