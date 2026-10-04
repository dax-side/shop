import type { NextRequest } from "next/server";
import { rooms } from "@/lib/catalogue";
import { json, originOf } from "@/lib/api/http";
import { productJson } from "@/lib/api/products";
import { getProducts } from "@/lib/products";

// GET /api/products?room=kitchen&q=mug
export async function GET(request: NextRequest) {
  const room = rooms.find((r) => r.slug === request.nextUrl.searchParams.get("room"))?.slug;
  const query = request.nextUrl.searchParams.get("q")?.trim().toLowerCase().slice(0, 60) ?? "";

  const products = (await getProducts(room)).filter(
    (product) =>
      !query ||
      [product.name, product.material, product.tagline, product.room].some((field) => field.toLowerCase().includes(query)),
  );

  const origin = originOf(request);
  return json({ rooms, products: products.map((product) => productJson(product, origin)) });
}
