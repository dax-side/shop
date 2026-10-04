import { z } from "zod";
import { apiError, json, readJson } from "@/lib/api/http";
import { getDb } from "@/db";
import { redeemAppSignInCode } from "@/lib/handoff";
import { createSession } from "@/lib/sessions";

const bodySchema = z.object({
  code: z.string().min(20).max(100),
  codeVerifier: z.string().min(43).max(128),
  device: z.string().trim().max(60).optional(),
});

// POST /api/mobile/auth/token: the app swaps the one-time code (plus its PKCE verifier) for a
// session token. The token is a row in the same sessions table the website uses.
export async function POST(request: Request) {
  const body = bodySchema.safeParse(await readJson(request));
  if (!body.success) return apiError(400, "Send { code, codeVerifier, device? }.");

  const userId = await redeemAppSignInCode(body.data.code, body.data.codeVerifier);
  if (!userId) return apiError(401, "This sign-in has expired. Please try again.");

  const user = await getDb().query.users.findFirst({ where: (users, { eq }) => eq(users.id, userId) });
  if (!user) return apiError(401, "Account not found.");

  const session = await createSession(userId, "app", body.data.device || "Phone");
  return json({
    token: session.token,
    expiresAt: session.expires.toISOString(),
    user: { id: user.id, name: user.name, email: user.email, image: user.image },
  });
}
