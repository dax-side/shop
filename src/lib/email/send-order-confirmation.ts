import "server-only";
import { findOrder } from "../orders";
import { siteUrl } from "../site";
import { mailgunConfigured, sendEmail } from "./mailgun";
import { orderConfirmationEmail } from "./order-confirmation";

export async function sendOrderConfirmation(orderId: string) {
  if (!mailgunConfigured()) {
    console.warn(`Mailgun not configured; skipped confirmation email for order ${orderId}.`);
    return;
  }

  const order = await findOrder(orderId);
  if (!order) return;

  const { subject, html, text } = orderConfirmationEmail(order, new URL(`/orders/${order.id}`, siteUrl()).toString());

  await sendEmail({
    to: order.email,
    subject,
    html,
    text,
    replyTo: process.env.STORE_EMAIL || undefined,
  });
}
