import { asc, inArray } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { json, unauthorized } from "@/lib/api/http";
import { getRequestUser } from "@/lib/api/request-user";
import { getOrdersForUser, STATUS_LABELS } from "@/lib/account";

// GET /api/orders: the signed-in user's orders, newest first, with their items.
export async function GET(request: Request) {
  const user = await getRequestUser(request);
  if (!user) return unauthorized();

  const orders = await getOrdersForUser(user.id);
  const items = orders.length
    ? await getDb()
        .select({
          orderId: schema.orderItems.orderId,
          name: schema.orderItems.name,
          finish: schema.orderItems.finish,
          quantity: schema.orderItems.quantity,
          lineTotal: schema.orderItems.lineTotal,
        })
        .from(schema.orderItems)
        .where(inArray(schema.orderItems.orderId, orders.map((order) => order.id)))
        .orderBy(asc(schema.orderItems.id))
    : [];

  return json({
    orders: orders.map((order) => ({
      ...order,
      statusLabel: STATUS_LABELS[order.status],
      createdAt: order.createdAt.toISOString(),
      path: `/orders/${order.id}`,
      items: items
        .filter((item) => item.orderId === order.id)
        .map((item) => ({ name: item.name, finish: item.finish, quantity: item.quantity, lineTotal: item.lineTotal })),
    })),
  });
}
