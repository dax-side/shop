import "server-only";
import { desc, eq } from "drizzle-orm";
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
