import { z } from "zod";
import { apiError, json, originOf, readJson, unauthorized } from "@/lib/api/http";
import { getRequestUser } from "@/lib/api/request-user";
import { createWebSessionCode, isSafeNextPath } from "@/lib/handoff";

const bodySchema = z.object({ next: z.string().max(200).optional() }).nullable();

// POST /api/mobile/web-session: the app asks for a link that opens the website already signed in
// to the same account (used for checkout). The link works once, within a minute.
export async function POST(request: Request) {
  const user = await getRequestUser(request);
  if (!user || user.client !== "app") return unauthorized();

  const body = bodySchema.safeParse(await readJson(request));
  const next = body.success && body.data?.next ? body.data.next : "/checkout";
  if (!isSafeNextPath(next)) return apiError(400, "next must be a path on this website.");

  const code = await createWebSessionCode(user.id);
  const url = new URL(`/api/mobile/web-session/${code}`, originOf(request));
  url.searchParams.set("next", next);
  return json({ url: url.toString() });
}
