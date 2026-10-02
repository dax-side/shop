import "server-only";
import { randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { after } from "next/server";
import { getDb, schema } from "@/db";
import { sendOrderConfirmation } from "./email/send-order-confirmation";
import { UUID_PATTERN, type OrderWithItems } from "./orders";
import {
  initializeTransaction,
  orderIdFromMetadata,
  type PaystackChannel,
  type PaystackTransaction,
} from "./paystack";
import { siteUrl } from "./site";

const CHANNELS: Record<OrderWithItems["paymentMethod"], PaystackChannel[]> = {
  card: ["card"],
  "bank-transfer": ["bank_transfer"],
  ussd: ["ussd"],
};

type PayableOrder = Pick<OrderWithItems, "id" | "reference" | "email" | "total" | "paymentMethod">;

// Starts a Paystack checkout for the order and returns the URL to send the customer to.
// Each attempt gets its own Paystack reference; the order is found again through metadata.
export async function startPayment(order: PayableOrder) {
  return initializeTransaction({
    email: order.email,
    amountKobo: order.total * 100,
    reference: `${order.reference}-${randomBytes(3).toString("hex").toUpperCase()}`,
    callbackUrl: new URL("/api/paystack/callback", siteUrl()).toString(),
    channels: CHANNELS[order.paymentMethod],
    orderId: order.id,
  });
}

export type PaymentOutcome =
  | { result: "paid" | "already-paid"; orderId: string }
  | { result: "failed"; orderId?: string; reason: string };

// Marks the order paid if the verified transaction matches it. Safe to call more than once:
// only the first successful call updates the order and sends the confirmation email.
export async function confirmPayment(transaction: PaystackTransaction): Promise<PaymentOutcome> {
  const orderId = orderIdFromMetadata(transaction.metadata);
  if (!orderId || !UUID_PATTERN.test(orderId)) return { result: "failed", reason: "Transaction has no valid order id" };

  if (transaction.status !== "success") return { result: "failed", orderId, reason: transaction.status };

  const db = getDb();
  const [order] = await db
    .select({ total: schema.orders.total, status: schema.orders.status })
    .from(schema.orders)
    .where(eq(schema.orders.id, orderId))
    .limit(1);

  if (!order) return { result: "failed", reason: "Order not found" };
  if (transaction.currency !== "NGN" || transaction.amount !== order.total * 100) {
    console.error(`Payment ${transaction.reference} does not match order ${orderId}`, transaction);
    return { result: "failed", orderId, reason: "Amount mismatch" };
  }

  const updated = await db
    .update(schema.orders)
    .set({
      status: "paid",
      paymentReference: transaction.reference,
      paidAt: transaction.paid_at ? new Date(transaction.paid_at) : new Date(),
    })
    .where(and(eq(schema.orders.id, orderId), eq(schema.orders.status, "pending_payment")))
    .returning({ id: schema.orders.id });

  if (updated.length === 0) return { result: "already-paid", orderId };

  after(() =>
    sendOrderConfirmation(orderId).catch((error) => console.error(`Confirmation email failed for ${orderId}`, error)),
  );
  return { result: "paid", orderId };
}
