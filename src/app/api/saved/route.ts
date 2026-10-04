import { json, originOf, unauthorized } from "@/lib/api/http";
import { productJson } from "@/lib/api/products";
import { getRequestUser } from "@/lib/api/request-user";
import { getSavedProducts } from "@/lib/saved";

// GET /api/saved: products the user has saved, newest first.
export async function GET(request: Request) {
  const user = await getRequestUser(request);
  if (!user) return unauthorized();
  const origin = originOf(request);
  const products = await getSavedProducts(user.id);
  return json({ slugs: products.map((product) => product.slug), products: products.map((p) => productJson(p, origin)) });
}
