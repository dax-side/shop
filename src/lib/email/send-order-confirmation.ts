import "server-only";
import { findOrder } from "../orders";
import { mailgunConfigured, sendEmail } from "./mailgun";
import { orderConfirmationEmail } from "./order-confirmation";

export async function sendOrderConfirmation(orderId: string) {
  if (!mailgunConfigured()) {
    console.warn(`Mailgun not configured; skipped confirmation email for order ${orderId}.`);
    return;
  }

  const order = await findOrder(orderId);
  if (!order) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { subject, html, text } = orderConfirmationEmail(order, new URL(`/orders/${order.id}`, siteUrl).toString());

  await sendEmail({
    to: order.email,
    subject,
    html,
    text,
    replyTo: process.env.STORE_EMAIL || undefined,
  });
}
