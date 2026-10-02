import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/legal-page";
import { formatNaira } from "@/lib/format";
import { pricing, site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of sale" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of sale" updated="October 2026">
      <p>
        These terms cover orders placed with {site.name}, {site.city}. By placing an order you agree to them. If
        anything is unclear, email <a href={`mailto:${site.email}`}>{site.email}</a> before you buy.
      </p>

      <h2>Prices and payment</h2>
      <ul>
        <li>All prices are in Nigerian Naira (₦) and include any applicable taxes.</li>
        <li>Payment is taken by Paystack by card, bank transfer or USSD. An order is confirmed once payment succeeds.</li>
        <li>If a price is shown in error, we&apos;ll contact you before dispatch and refund you in full if you prefer.</li>
      </ul>

      <h2>Delivery and pickup</h2>
      <ul>
        <li>Lagos orders usually arrive in 1–2 days. Elsewhere in Nigeria, {site.deliveryDays} days.</li>
        <li>
          Delivery costs {formatNaira(pricing.deliveryFee)}, and is free on orders over{" "}
          {formatNaira(pricing.freeDeliveryThreshold)}.
        </li>
        <li>
          Pickup is free from {site.storeAddress}, open {site.openingHours}. We&apos;ll email you when your order is
          ready.
        </li>
      </ul>

      <h2>Returns and refunds</h2>
      <ul>
        <li>You can return unused items within {site.returnWindowDays} days of receiving them for a full refund.</li>
        <li>If something arrives damaged or wrong, tell us within {site.returnWindowDays} days and we&apos;ll put it right.</li>
        <li>Refunds go back to the original payment method once we receive the item.</li>
      </ul>

      <h2>Handmade goods</h2>
      <p>
        Many pieces are made by hand, so colour, glaze and size can vary slightly from the photos. That&apos;s part of
        their character, not a fault.
      </p>

      <h2>Your data</h2>
      <p>
        How we handle your details is set out in our <Link href="/privacy">privacy policy</Link>.
      </p>

      <h2>Contact</h2>
      <p>
        {site.name}, {site.storeAddress}. Email <a href={`mailto:${site.email}`}>{site.email}</a> or call{" "}
        {site.phone}.
      </p>
    </LegalPage>
  );
}
