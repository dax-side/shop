import type { NextRequest } from "next/server";
import { apiError, json, originOf } from "@/lib/api/http";
import { productJson } from "@/lib/api/products";
import { getProduct } from "@/lib/products";

// GET /api/products/clay-water-pot
export async function GET(request: NextRequest, ctx: RouteContext<"/api/products/[slug]">) {
  const product = await getProduct((await ctx.params).slug);
  if (!product) return apiError(404, "Product not found.");
  return json({ product: productJson(product, originOf(request)) });
}
