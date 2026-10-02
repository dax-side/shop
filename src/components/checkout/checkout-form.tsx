"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { bagStore, itemKey, type BagItem } from "@/lib/bag-store";
import { placeOrder, type CheckoutState } from "@/lib/checkout";
import { formatNaira } from "@/lib/format";
import { NIGERIAN_STATES } from "@/lib/nigeria";
import { productThumb } from "@/lib/product-images";
import { orderTotals, type FulfilmentMethod, type PricingConfig } from "@/lib/pricing";
import { GoogleButton } from "../auth/google-button";
import { useBag } from "../bag/use-bag";
import { ArrowRightIcon } from "../icons";
import { ProductThumb } from "../product-photo";
import { Choice, SelectField, Step, TextField } from "./fields";

type CheckoutFormProps = {
  prices: Record<string, number>;
  pricing: PricingConfig;
  deliveryDays: string;
  account: { email: string; name: string } | null;
  googleEnabled: boolean;
};

const initialState: CheckoutState = { status: "idle" };

async function submitOrder(prev: CheckoutState, formData: FormData) {
  const result = await placeOrder(prev, formData);
  if (result.status === "success") bagStore.clear();
  return result;
}

const subscribeNoop = () => () => {};

export function CheckoutForm({
  prices,
  pricing,
  deliveryDays,
  account,
  googleEnabled,
}: CheckoutFormProps) {
  const [firstName = "", ...rest] = account?.name.split(" ") ?? [];
  const lastName = rest.join(" ");
  const bag = useBag();
  // Show current server prices so the summary matches what will be charged.
  const items = bag.items.map((item) => ({ ...item, price: prices[item.slug] ?? item.price }));
  const { count } = bag;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [state, action, pending] = useActionState(submitOrder, initialState);
  const [method, setMethod] = useState<FulfilmentMethod>("delivery");
  const [payment, setPayment] = useState("card");
  const router = useRouter();

  useEffect(() => {
    if (state.status !== "success") return;
    if (state.paymentUrl) window.location.assign(state.paymentUrl);
    else router.replace(`/orders/${state.orderId}`);
  }, [state, router]);

  const totals = orderTotals(subtotal, method, pricing);
  const errors = state.status === "error" ? state.fieldErrors : {};
  const deliveryFee = totals.subtotal >= pricing.freeDeliveryThreshold ? "Free" : formatNaira(pricing.deliveryFee);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set(
      "bag",
      JSON.stringify(items.map(({ slug, finish, quantity }) => ({ slug, finish, quantity }))),
    );
    startTransition(() => action(formData));
  }

  if (state.status === "success") {
    return (
      <p role="status" className="py-10 font-serif text-2xl italic">
        Order {state.reference} saved. {state.paymentUrl ? "Taking you to Paystack to pay…" : "Taking you to your order…"}
      </p>
    );
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="py-10">
        <p className="font-serif text-2xl italic">Your bag is empty.</p>
        <Link
          href="/#catalogue"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm text-paper hover:bg-ink/85"
        >
          Shop the catalogue <ArrowRightIcon width={12} height={12} />
        </Link>
      </div>
    );
  }

  const payButton = (
    <button
      type="submit"
      disabled={pending || !hydrated}
      className="h-12 w-full rounded-full bg-ink text-sm text-paper hover:bg-ink/85 disabled:opacity-60"
    >
      {pending ? "Placing order…" : "Pay and place order"}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-10 lg:grid-cols-12 lg:gap-6">
      <details className="-mx-4 border-y border-ink px-4 lg:hidden">
        <summary className="flex h-12 cursor-pointer list-none items-center justify-between text-sm">
          <span>Show order summary ({count}) ⌄</span>
          <span className="font-mono">{formatNaira(totals.total)}</span>
        </summary>
        <BagLines items={items} />
      </details>

      <div className="lg:col-span-6">
        {state.status === "error" && (
          <p role="alert" className="mb-6 border border-accent p-3 text-sm text-accent">
            {errors.bag ?? errors.method ?? state.message}
          </p>
        )}

        <Step number="01" title="Contact">
          {account ? (
            <p className="mb-4 text-sm">
              Signed in as <span className="font-medium">{account.email}</span>.
            </p>
          ) : (
            googleEnabled && (
              <>
                <GoogleButton callbackUrl="/checkout" label="Continue with Google" />
                <p className="label my-4 flex items-center gap-3 text-[0.625rem] text-muted before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">
                  Or as a guest
                </p>
              </>
            )
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              defaultValue={account?.email}
              error={errors.email}
            />
            <TextField
              name="phone"
              label="Phone"
              type="tel"
              autoComplete="tel"
              placeholder="080 0000 0000"
              error={errors.phone}
            />
          </div>
          <p className="mt-2 text-xs text-muted">We send your receipt here, plus a message when your order is on its way.</p>
        </Step>

        <Step number="02" title="How you get it">
          <div className="grid gap-2 sm:grid-cols-2">
            <Choice
              name="method"
              value="delivery"
              checked={method === "delivery"}
              onChange={() => setMethod("delivery")}
              title="Delivery"
              aside={deliveryFee}
              description={`Lagos in 1–2 days. Elsewhere in ${deliveryDays} days.`}
            />
            <Choice
              name="method"
              value="pickup"
              checked={method === "pickup"}
              onChange={() => setMethod("pickup")}
              title="Pickup"
              aside="Free"
              description="Collect from the shop, usually ready the same day."
            />
          </div>
        </Step>

        <Step number="03" title={method === "delivery" ? "Delivery address" : "Who's collecting"}>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              name="firstName"
              label="First name"
              autoComplete="given-name"
              defaultValue={firstName}
              error={errors.firstName}
            />
            <TextField
              name="lastName"
              label="Last name"
              autoComplete="family-name"
              defaultValue={lastName}
              error={errors.lastName}
            />
            {method === "delivery" && (
              <>
                <TextField
                  name="street"
                  label="Street address"
                  autoComplete="street-address"
                  placeholder="House number and street"
                  error={errors.street}
                  className="sm:col-span-2"
                />
                <TextField
                  name="landmark"
                  label="Nearest landmark"
                  optional
                  placeholder="Helps the rider find you"
                  error={errors.landmark}
                  className="sm:col-span-2"
                />
                <TextField name="area" label="Area / LGA" placeholder="e.g. Ikeja" error={errors.area} />
                <SelectField
                  name="state"
                  label="State"
                  options={NIGERIAN_STATES}
                  defaultValue="Lagos"
                  error={errors.state}
                />
              </>
            )}
          </div>
        </Step>

        <Step number="04" title="Payment">
          <div className="grid gap-2">
            <Choice
              name="payment"
              value="card"
              checked={payment === "card"}
              onChange={setPayment}
              title="Card"
              description="Visa, Mastercard, Verve"
            />
            <Choice
              name="payment"
              value="bank-transfer"
              checked={payment === "bank-transfer"}
              onChange={setPayment}
              title="Bank transfer"
              description="Pay into a one-time account number"
            />
            <Choice
              name="payment"
              value="ussd"
              checked={payment === "ussd"}
              onChange={setPayment}
              title="USSD"
              description="Pay from your phone with a short code"
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            Payments are handled securely by Paystack. We never see or store your card details.
          </p>
        </Step>

        <div className="mt-10 border-t border-ink pt-4 lg:hidden">
          <div className="mb-4 flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-mono text-lg">{formatNaira(totals.total)}</span>
          </div>
          {payButton}
        </div>
      </div>

      <aside className="hidden self-start border border-ink lg:col-span-5 lg:col-start-8 lg:block">
        <div className="flex items-end justify-between border-b border-ink p-4">
          <h2 className="display text-3xl">Your bag</h2>
          <span className="label text-[0.625rem]">
            {count} {count === 1 ? "item" : "items"}
          </span>
        </div>
        <div className="px-4">
          <BagLines items={items} />
        </div>
        <dl className="space-y-1 border-t border-ink p-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd className="font-mono">{formatNaira(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd className="font-mono">{totals.delivery === 0 ? "Free" : formatNaira(totals.delivery)}</dd>
          </div>
        </dl>
        <div className="border-t border-ink p-4">
          <div className="mb-4 flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-mono text-lg">{formatNaira(totals.total)}</span>
          </div>
          {payButton}
          <p className="mt-3 text-center text-[0.6875rem] text-muted">
            By placing your order you agree to our terms and returns policy.
          </p>
        </div>
      </aside>
    </form>
  );
}

function BagLines({ items }: { items: BagItem[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={itemKey(item)} className="flex items-center gap-3 border-b border-line py-3 last:border-b-0">
          <ProductThumb image={productThumb(item.slug)} tone={item.tone} className="size-11" />
          <span className="flex-1">
            <span className="block text-sm font-medium">{item.name}</span>
            <span className="font-mono text-[0.625rem] text-muted">
              {item.finish ? `${item.finish} · ` : ""}Qty {item.quantity}
            </span>
          </span>
          <span className="font-mono text-xs">{formatNaira(item.price * item.quantity)}</span>
        </li>
      ))}
    </ul>
  );
}
