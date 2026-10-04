import "server-only";
import { and, eq, gt } from "drizzle-orm";
import { authConfigured } from "@/auth";
import { getDb, schema } from "@/db";
import { touchSession, webDeviceLabel, webSessionToken } from "@/lib/sessions";

export type RequestUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  // "app" when the request carries a Bearer token, "web" for the website's session cookie.
  client: "app" | "web";
  sessionToken: string;
};

function bearerToken(request: Request) {
  const header = request.headers.get("authorization");
  return header?.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : null;
}

async function userForSession(token: string) {
  const [row] = await getDb()
    .select({
      id: schema.users.id,
      name: schema.users.name,
      email: schema.users.email,
      image: schema.users.image,
      device: schema.sessions.device,
    })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .where(and(eq(schema.sessions.sessionToken, token), gt(schema.sessions.expires, new Date())))
    .limit(1);
  return row;
}

// Resolves the signed-in user for an API request from either client. The app sends
// `Authorization: Bearer <token>`; the website sends its Auth.js session cookie. Both are rows in
// the same sessions table, so they are the same account.
export async function getRequestUser(request: Request): Promise<RequestUser | null> {
  const bearer = bearerToken(request);
  const token = bearer ?? (authConfigured() ? webSessionToken(request) : null);
  if (!token) return null;

  const row = await userForSession(token);
  if (!row) return null;

  const client = bearer ? "app" : "web";
  const device = row.device ?? (client === "web" ? webDeviceLabel(request.headers.get("user-agent")) : "Phone");
  await touchSession(token, device).catch((error) => console.error("touchSession failed", error));

  return { id: row.id, name: row.name, email: row.email, image: row.image, client, sessionToken: token };
}
