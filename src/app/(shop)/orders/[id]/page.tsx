import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { formatNaira } from "@/lib/format";
import { getOrder, nextSteps, PAYMENT_LABELS } from "@/lib/orders";

// Order pages contain personal details; keep them out of search results.
export const metadata: Metadata = { title: "Your order", robots: { index: false, follow: false } };

const dateFormat = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" });

export default async function OrderPage({ params }: PageProps<"/orders/[id]">) {
  const order = await getOrder((await params).id);
  if (!order) notFound();

  const steps = nextSteps(order.method);

  return (
    <>
      <main className="flex-1">
        <div className="bg-ink text-paper">
          <div className="container-page flex h-9 items-center justify-between font-mono text-[0.6875rem]">
            <span>Order {order.reference}</span>
            <span>{dateFormat.format(order.createdAt)}</span>
          </div>
        </div>

        <section className="container-page max-w-3xl py-10 sm:py-14">
          <h1 className="display text-6xl sm:text-8xl">
            Order
            <br />
            confirmed.
          </h1>
          <p className="mt-5 font-serif text-2xl italic">Thanks, {order.firstName}. We&apos;re packing it now.</p>
          <p className="mt-3 max-w-xl">
            Here&apos;s what you ordered. We&apos;ll email you again
            {order.method === "delivery" ? " with tracking once it leaves the shop." : " when it's ready to collect."}
          </p>

          <h2 className="label mt-10 text-[0.625rem]">In your order</h2>
          <ul className="mt-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 border-b border-line py-3">
                <span className="size-14 shrink-0" style={{ background: item.tone }} />
                <span className="flex-1">
                  <span className="block font-medium">{item.name}</span>
                  <span className="font-mono text-[0.6875rem] text-muted">
                    No. {item.number}
                    {item.finish && ` · ${item.finish}`} · Qty {item.quantity}
                  </span>
                </span>
                <span className="font-mono text-sm">{formatNaira(item.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <dl className="space-y-1 border-b border-ink py-4">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="font-mono">{formatNaira(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{order.method === "delivery" ? "Delivery" : "Pickup"}</dt>
              <dd className="font-mono">{order.delivery === 0 ? "Free" : formatNaira(order.delivery)}</dd>
            </div>
            <div className="flex justify-between pt-1 text-lg font-medium">
              <dt>Total</dt>
              <dd className="font-mono">{formatNaira(order.total)}</dd>
            </div>
          </dl>

          <div className="grid gap-6 py-6 sm:grid-cols-2">
            <div>
              <h2 className="label text-[0.625rem]">{order.method === "delivery" ? "Delivering to" : "Collecting"}</h2>
              <p className="mt-2 leading-snug">
                {order.firstName} {order.lastName}
                {order.method === "delivery" && (
                  <>
                    <br />
                    {order.street}
                    <br />
                    {order.area}, {order.state}
                  </>
                )}
                <br />
                {order.phone}
              </p>
            </div>
            <div>
              <h2 className="label text-[0.625rem]">Paying with</h2>
              <p className="mt-2 leading-snug">
                {PAYMENT_LABELS[order.paymentMethod]}
                <br />
                {order.method === "delivery" ? "Arrives in 1–2 days in Lagos" : "Usually ready the same day"}
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-ink">
          <div className="container-page max-w-3xl py-10">
            <h2 className="label text-[0.625rem]">What happens next</h2>
            <ol className="mt-4 space-y-3">
              {steps.map((step, index) => (
                <li key={step.title} className="grid grid-cols-[3rem_1fr]">
                  <span className="font-mono text-xs">{String(index + 1).padStart(2, "0")}</span>
                  <p>
                    <strong className="font-medium">{step.title}</strong> {step.body}
                  </p>
                </li>
              ))}
            </ol>
            <Link
              href="/#catalogue"
              className="mt-8 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm text-paper hover:bg-ink/85"
            >
              Keep shopping
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
