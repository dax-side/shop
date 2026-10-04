import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, isNull, lt } from "drizzle-orm";
import { getDb, schema } from "@/db";

const SESSION_DAYS = 30;

export const newToken = () => randomBytes(32).toString("base64url");
export const sha256 = (value: string) => createHash("sha256").update(value).digest("base64url");

// Matches the cookie Auth.js uses for database sessions (prefixed on https).
export function sessionCookieName(request: Request) {
  const secure = new URL(request.url).protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
  return { name: `${secure ? "__Secure-" : ""}authjs.session-token`, secure };
}

export function webSessionToken(request: Request) {
  const cookies = request.headers.get("cookie") ?? "";
  const match = cookies.match(/(?:^|;\s*)(?:__Secure-)?authjs\.session-token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// "Website, Chrome", "Website, Safari"…
export function webDeviceLabel(userAgent: string | null) {
  const ua = userAgent ?? "";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /SamsungBrowser/.test(ua)
        ? "Samsung Internet"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : /Chrome\//.test(ua)
            ? "Chrome"
            : /Safari\//.test(ua)
              ? "Safari"
              : "browser";
  return `Website, ${browser}`;
}

export async function createSession(userId: string, client: "web" | "app", device: string | null) {
  const token = newToken();
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await getDb().insert(schema.sessions).values({ sessionToken: token, userId, expires, client, device });
  return { token, expires };
}

// Records when a session was last used (at most once a minute) and labels it the first time.
export async function touchSession(token: string, device: string) {
  const now = new Date();
  await getDb()
    .update(schema.sessions)
    .set({ lastSeenAt: now })
    .where(and(eq(schema.sessions.sessionToken, token), lt(schema.sessions.lastSeenAt, new Date(now.getTime() - 60_000))));
  await getDb()
    .update(schema.sessions)
    .set({ device })
    .where(and(eq(schema.sessions.sessionToken, token), isNull(schema.sessions.device)));
}

// Public id for a session, so the account screen can list devices without exposing tokens.
export const sessionId = (token: string) => sha256(token).slice(0, 12);
