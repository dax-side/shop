import { z } from "zod";
import { apiError, json, readJson, unauthorized } from "@/lib/api/http";
import { getRequestUser } from "@/lib/api/request-user";
import { deleteAccount, getAccountCounts, getProvider, getSessionsForUser } from "@/lib/account";
import { sessionId } from "@/lib/sessions";

// GET /api/me: the signed-in account, where it is signed in, and how many orders and saved items.
export async function GET(request: Request) {
  const user = await getRequestUser(request);
  if (!user) return unauthorized();

  const [provider, sessions, counts] = await Promise.all([
    getProvider(user.id),
    getSessionsForUser(user.id),
    getAccountCounts(user.id),
  ]);

  return json({
    user: { id: user.id, name: user.name, email: user.email, image: user.image },
    provider,
    client: user.client,
    sessions: sessions.map((session) => ({
      id: sessionId(session.sessionToken),
      client: session.client,
      device: session.device ?? (session.client === "app" ? "Phone" : "Website"),
      lastSeenAt: session.lastSeenAt.toISOString(),
      current: session.sessionToken === user.sessionToken,
    })),
    counts,
  });
}

const deleteSchema = z.object({ confirm: z.literal("delete my account") });

// DELETE /api/me with { confirm: "delete my account" }: deletes the account and signs out everywhere.
export async function DELETE(request: Request) {
  const user = await getRequestUser(request);
  if (!user) return unauthorized();
  if (!deleteSchema.safeParse(await readJson(request)).success) {
    return apiError(400, 'Send { confirm: "delete my account" } to delete this account.');
  }
  await deleteAccount(user.id);
  return json({ deleted: true });
}
