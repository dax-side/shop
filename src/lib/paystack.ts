import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// Thin client for the Paystack API. Test keys (sk_test_…) run everything in test mode.

export type PaystackChannel = "card" | "bank_transfer" | "ussd";

export type PaystackTransaction = {
  status: "success" | "failed" | "abandoned" | "ongoing" | "pending" | "processing" | "queued" | "reversed";
  reference: string;
  amount: number;
  currency: string;
  paid_at: string | null;
  metadata: { order_id?: string } | string | null;
};

export function paystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

function secretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set.");
  return key;
}

async function paystack<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = process.env.PAYSTACK_API_URL || "https://api.paystack.co";
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${secretKey()}`, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(15_000),
    cache: "no-store",
  });
  const body = (await response.json().catch(() => null)) as { status?: boolean; message?: string; data?: T } | null;
  if (!response.ok || !body?.status || !body.data) {
    throw new Error(`Paystack ${path} failed (${response.status}): ${body?.message ?? "no response body"}`);
  }
  return body.data;
}

export async function initializeTransaction(input: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  channels: PaystackChannel[];
  orderId: string;
}) {
  const data = await paystack<{ authorization_url: string; reference: string }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo,
      currency: "NGN",
      reference: input.reference,
      callback_url: input.callbackUrl,
      channels: input.channels,
      metadata: { order_id: input.orderId },
    }),
  });
  return data.authorization_url;
}

export function verifyTransaction(reference: string) {
  return paystack<PaystackTransaction>(`/transaction/verify/${encodeURIComponent(reference)}`);
}

// Webhooks are signed with HMAC-SHA512 of the raw body using the secret key.
export function validWebhookSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const expected = createHmac("sha512", secretKey()).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function orderIdFromMetadata(metadata: PaystackTransaction["metadata"]) {
  if (!metadata) return undefined;
  try {
    const parsed = typeof metadata === "string" ? (JSON.parse(metadata) as { order_id?: string }) : metadata;
    return typeof parsed.order_id === "string" ? parsed.order_id : undefined;
  } catch {
    return undefined;
  }
}
