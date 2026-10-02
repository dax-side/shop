import { NextResponse, type NextRequest } from "next/server";
import { confirmPayment } from "@/lib/payments";
import { paystackConfigured, validWebhookSignature, verifyTransaction } from "@/lib/paystack";

// Set this URL as the webhook in the Paystack dashboard. It confirms payments even when
// the customer closes the tab before being redirected back.
export async function POST(request: NextRequest) {
  if (!paystackConfigured()) return new NextResponse(null, { status: 503 });

  const rawBody = await request.text();
  if (!validWebhookSignature(rawBody, request.headers.get("x-paystack-signature"))) {
    return new NextResponse(null, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  if (event.event === "charge.success" && event.data?.reference) {
    try {
      // Re-verify with the API rather than trusting the payload's amount and status.
      const outcome = await confirmPayment(await verifyTransaction(event.data.reference));
      if (outcome.result === "failed") console.warn(`Webhook payment not applied: ${outcome.reason}`);
    } catch (error) {
      console.error("Paystack webhook failed", error);
      // A non-2xx response makes Paystack retry later.
      return new NextResponse(null, { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
