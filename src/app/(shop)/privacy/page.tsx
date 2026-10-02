import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="October 2026">
      <p>
        This policy explains what {site.name} collects when you use this site, why, and what you can ask us to do with
        it. We follow the Nigeria Data Protection Act 2023.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Order details: your name, email, phone number and, for delivery, your address.</li>
        <li>Account details if you sign in with Google: your name, email address and profile picture.</li>
        <li>Your email address if you join the newsletter.</li>
        <li>Items in your bag, stored only in your own browser until you check out.</li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To take payment, deliver your order and send your receipt and delivery updates.</li>
        <li>To show your order history when you&apos;re signed in.</li>
        <li>To send the newsletter, only if you asked for it.</li>
      </ul>

      <h2>Who we share it with</h2>
      <ul>
        <li>Paystack, to process payments. We never see or store your card details.</li>
        <li>Mailgun, to send order emails.</li>
        <li>Google, only if you choose to sign in with Google.</li>
        <li>Our hosting and database providers (Vercel and Neon), which store the site and your order records.</li>
      </ul>
      <p>We don&apos;t sell your data or share it for advertising.</p>

      <h2>Cookies</h2>
      <p>
        We use one essential cookie to keep you signed in. There are no advertising or tracking cookies.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep order records for as long as we need them for accounting and returns. You can ask us to delete your
        account and newsletter signup at any time.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to see, correct or delete the personal data we hold about you. Email{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> and we&apos;ll reply within 30 days.
      </p>
    </LegalPage>
  );
}
