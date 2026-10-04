import "server-only";
import { and, count, desc, eq, gt, isNotNull } from "drizzle-orm";
import { getDb, schema } from "@/db";

export async function getOrdersForUser(userId: string) {
  return getDb()
    .select({
      id: schema.orders.id,
      reference: schema.orders.reference,
      status: schema.orders.status,
      total: schema.orders.total,
      method: schema.orders.method,
      createdAt: schema.orders.createdAt,
    })
    .from(schema.orders)
    .where(eq(schema.orders.userId, userId))
    .orderBy(desc(schema.orders.createdAt))
    .limit(50);
}

export const STATUS_LABELS: Record<(typeof schema.orderStatusEnum.enumValues)[number], string> = {
  pending_payment: "Awaiting payment",
  paid: "Paid",
  packed: "Packed",
  dispatched: "On its way",
  completed: "Completed",
  cancelled: "Cancelled",
};

// Where the account is signed in: the website and any phones, most recently used first.
export async function getSessionsForUser(userId: string) {
  return getDb()
    .select({
      sessionToken: schema.sessions.sessionToken,
      client: schema.sessions.client,
      device: schema.sessions.device,
      lastSeenAt: schema.sessions.lastSeenAt,
    })
    .from(schema.sessions)
    .where(and(eq(schema.sessions.userId, userId), gt(schema.sessions.expires, new Date())))
    .orderBy(desc(schema.sessions.lastSeenAt))
    .limit(20);
}

export async function getProvider(userId: string) {
  const [account] = await getDb()
    .select({ provider: schema.accounts.provider })
    .from(schema.accounts)
    .where(eq(schema.accounts.userId, userId))
    .limit(1);
  return account?.provider ?? null;
}

export async function getAccountCounts(userId: string) {
  const db = getDb();
  const [[orders], [saved]] = await Promise.all([
    db.select({ value: count() }).from(schema.orders).where(eq(schema.orders.userId, userId)),
    db.select({ value: count() }).from(schema.savedItems).where(eq(schema.savedItems.userId, userId)),
  ]);
  return { orders: orders.value, saved: saved.value };
}

// Delivery addresses from past orders, newest first, without repeats.
export async function getSavedAddresses(userId: string) {
  const rows = await getDb()
    .select({
      firstName: schema.orders.firstName,
      lastName: schema.orders.lastName,
      phone: schema.orders.phone,
      street: schema.orders.street,
      landmark: schema.orders.landmark,
      area: schema.orders.area,
      state: schema.orders.state,
      usedAt: schema.orders.createdAt,
    })
    .from(schema.orders)
    .where(and(eq(schema.orders.userId, userId), eq(schema.orders.method, "delivery"), isNotNull(schema.orders.street)))
    .orderBy(desc(schema.orders.createdAt))
    .limit(50);

  const seen = new Set<string>();
  return rows
    .filter((row) => {
      const key = [row.street, row.area, row.state].join("|").toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 5)
    .map((row) => ({ ...row, usedAt: row.usedAt.toISOString() }));
}

// Removes the user and everything tied to them (sessions, bag, saved items). Orders are kept for
// the shop's records but no longer linked to the account.
export async function deleteAccount(userId: string) {
  await getDb().delete(schema.users).where(eq(schema.users.id, userId));
}
