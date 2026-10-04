import "server-only";
import { and, eq, gt, isNull } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { newToken, sha256 } from "./sessions";

const APP_SIGN_IN_TTL_MS = 5 * 60 * 1000;
const WEB_SESSION_TTL_MS = 60 * 1000;

// Where the website may send an app sign-in code: the app's own scheme, Expo Go during
// development, or localhost (the app running in a browser). Never an arbitrary website.
export function isAllowedAppRedirect(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 500) return false;
  try {
    const url = new URL(value);
    if (["ojasupply:", "exp:", "exps:"].includes(url.protocol)) return true;
    return url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
  } catch {
    return false;
  }
}

// PKCE S256 challenges are 43 base64url characters.
export const isCodeChallenge = (value: unknown): value is string =>
  typeof value === "string" && /^[A-Za-z0-9_-]{43}$/.test(value);

export async function createAppSignInCode(userId: string, codeChallenge: string, redirectUri: string) {
  const code = newToken();
  await getDb()
    .insert(schema.handoffCodes)
    .values({
      codeHash: sha256(code),
      purpose: "app_sign_in",
      userId,
      codeChallenge,
      redirectUri,
      expiresAt: new Date(Date.now() + APP_SIGN_IN_TTL_MS),
    });
  return code;
}

export async function createWebSessionCode(userId: string) {
  const code = newToken();
  await getDb()
    .insert(schema.handoffCodes)
    .values({ codeHash: sha256(code), purpose: "web_session", userId, expiresAt: new Date(Date.now() + WEB_SESSION_TTL_MS) });
  return code;
}

// Marks a code used and returns it, only if it exists, matches the purpose, is unused and unexpired.
async function redeem(code: string, purpose: "app_sign_in" | "web_session") {
  const [row] = await getDb()
    .update(schema.handoffCodes)
    .set({ usedAt: new Date() })
    .where(
      and(
        eq(schema.handoffCodes.codeHash, sha256(code)),
        eq(schema.handoffCodes.purpose, purpose),
        isNull(schema.handoffCodes.usedAt),
        gt(schema.handoffCodes.expiresAt, new Date()),
      ),
    )
    .returning({ userId: schema.handoffCodes.userId, codeChallenge: schema.handoffCodes.codeChallenge });
  return row;
}

export async function redeemAppSignInCode(code: string, codeVerifier: string) {
  const row = await redeem(code, "app_sign_in");
  if (!row || row.codeChallenge !== sha256(codeVerifier)) return null;
  return row.userId;
}

export async function redeemWebSessionCode(code: string) {
  return (await redeem(code, "web_session"))?.userId ?? null;
}
