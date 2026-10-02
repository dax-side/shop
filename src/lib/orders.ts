import "server-only";
import { asc, eq } from "drizzle-orm";
import { connection } from "next/server";
import { getDb, schema } from "@/db";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getOrder(id: string) {
  await connection();
  if (!UUID_PATTERN.test(id)) return undefined;

  return getDb().query.orders.findFirst({
    where: eq(schema.orders.id, id),
    with: { items: { orderBy: asc(schema.orderItems.id) } },
  });
}

export type OrderWithItems = NonNullable<Awaited<ReturnType<typeof getOrder>>>;

export const PAYMENT_LABELS: Record<OrderWithItems["paymentMethod"], string> = {
  card: "Card",
  "bank-transfer": "Bank transfer",
  ussd: "USSD",
};
