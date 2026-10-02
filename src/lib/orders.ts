import "server-only";
import { asc, eq } from "drizzle-orm";
import { connection } from "next/server";
import { getDb, schema } from "@/db";
import { site } from "./site";

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function findOrder(id: string) {
  if (!UUID_PATTERN.test(id)) return undefined;

  return getDb().query.orders.findFirst({
    where: eq(schema.orders.id, id),
    with: { items: { orderBy: asc(schema.orderItems.id) } },
  });
}

// For pages: renders per request.
export async function getOrder(id: string) {
  await connection();
  return findOrder(id);
}

export type OrderWithItems = NonNullable<Awaited<ReturnType<typeof findOrder>>>;

export const PAYMENT_LABELS: Record<OrderWithItems["paymentMethod"], string> = {
  card: "Card",
  "bank-transfer": "Bank transfer",
  ussd: "USSD",
};

export function nextSteps(method: OrderWithItems["method"]) {
  return [
    { title: "We pack it.", body: "Fragile pieces go in straw and card, no plastic." },
    method === "delivery"
      ? { title: "It leaves the shop.", body: "You get a second email with the rider's details." }
      : { title: "It's ready for you.", body: `Collect it from ${site.storeAddress}. Open ${site.openingHours}.` },
    {
      title: method === "delivery" ? "It arrives." : "You pick it up.",
      body: `Something wrong? Reply to your confirmation email within ${site.returnWindowDays} days.`,
    },
  ];
}
