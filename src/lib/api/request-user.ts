import "server-only";
import { and, eq, gt } from "drizzle-orm";
import { auth, authConfigured } from "@/auth";
import { getDb, schema } from "@/db";

export type RequestUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  // "app" when the request carries a Bearer token, "web" for the website's session cookie.
  client: "app" | "web";
};

function bearerToken(request: Request) {
  const header = request.headers.get("authorization");
  return header?.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : null;
}

// Resolves the signed-in user for an API request from either client.
// The app sends `Authorization: Bearer <token>`; the website sends its Auth.js session cookie.
export async function getRequestUser(request: Request): Promise<RequestUser | null> {
  const token = bearerToken(request);
  if (token) {
    const [row] = await getDb()
      .select({ id: schema.users.id, name: schema.users.name, email: schema.users.email, image: schema.users.image })
      .from(schema.sessions)
      .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
      .where(and(eq(schema.sessions.sessionToken, token), gt(schema.sessions.expires, new Date())))
      .limit(1);
    return row ? { ...row, client: "app" } : null;
  }

  if (!authConfigured()) return null;
  const session = await auth();
  const user = session?.user;
  if (!user?.id) return null;
  return { id: user.id, name: user.name ?? null, email: user.email ?? null, image: user.image ?? null, client: "web" };
}
