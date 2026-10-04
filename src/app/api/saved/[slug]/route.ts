import type { NextRequest } from "next/server";
import { apiError, json, unauthorized } from "@/lib/api/http";
import { getRequestUser } from "@/lib/api/request-user";
import { setSaved } from "@/lib/saved";

async function update(request: NextRequest, ctx: RouteContext<"/api/saved/[slug]">, saved: boolean) {
  const user = await getRequestUser(request);
  if (!user) return unauthorized();
  const slug = (await ctx.params).slug;
  if (!(await setSaved(user.id, slug, saved))) return apiError(404, "Product not found.");
  return json({ slug, saved });
}

// PUT /api/saved/clay-water-pot saves a product; DELETE removes it.
export function PUT(request: NextRequest, ctx: RouteContext<"/api/saved/[slug]">) {
  return update(request, ctx, true);
}

export function DELETE(request: NextRequest, ctx: RouteContext<"/api/saved/[slug]">) {
  return update(request, ctx, false);
}
