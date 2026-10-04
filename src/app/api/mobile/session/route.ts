import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { json, unauthorized } from "@/lib/api/http";
import { getRequestUser } from "@/lib/api/request-user";

// DELETE /api/mobile/session: sign the app out (ends only this device's session).
export async function DELETE(request: Request) {
  const user = await getRequestUser(request);
  if (!user || user.client !== "app") return unauthorized();
  await getDb().delete(schema.sessions).where(eq(schema.sessions.sessionToken, user.sessionToken));
  return json({ signedOut: true });
}
