"use server";

import { redirect } from "next/navigation";
import { findOrder } from "./orders";
import { startPayment } from "./payments";
import { paystackConfigured } from "./paystack";

export async function payForOrder(orderId: string) {
  const order = await findOrder(orderId);
  if (!order) redirect("/");
  if (order.status !== "pending_payment") redirect(`/orders/${order.id}`);
  if (!paystackConfigured()) redirect(`/orders/${order.id}?payment=unavailable`);

  let paymentUrl: string;
  try {
    paymentUrl = await startPayment(order);
  } catch (error) {
    console.error(`Could not start payment for ${order.reference}`, error);
    redirect(`/orders/${order.id}?payment=unavailable`);
  }
  redirect(paymentUrl);
}
