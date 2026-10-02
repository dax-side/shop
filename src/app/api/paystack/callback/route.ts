import { NextResponse, type NextRequest } from "next/server";
import { confirmPayment } from "@/lib/payments";
import { verifyTransaction } from "@/lib/paystack";

// Paystack sends the customer here after checkout with ?reference=…
export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference") ?? request.nextUrl.searchParams.get("trxref");
  const home = new URL("/", request.url);
  if (!reference) return NextResponse.redirect(home);

  try {
    const outcome = await confirmPayment(await verifyTransaction(reference));
    if (!outcome.orderId) return NextResponse.redirect(home);

    const orderUrl = new URL(`/orders/${outcome.orderId}`, request.url);
    if (outcome.result === "failed") orderUrl.searchParams.set("payment", "failed");
    return NextResponse.redirect(orderUrl);
  } catch (error) {
    console.error(`Paystack callback failed for ${reference}`, error);
    return NextResponse.redirect(home);
  }
}
