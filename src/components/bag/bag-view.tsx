"use client";

import Link from "next/link";
import { bagStore, itemKey } from "@/lib/bag-store";
import { formatNaira } from "@/lib/format";
import { ArrowRightIcon } from "../icons";
import { QuantityStepper } from "../quantity-stepper";
import { useBag } from "./use-bag";

export function BagView() {
  const { items, count, subtotal } = useBag();

  return (
    <section className="container-page py-10 sm:py-14">
      <div className="flex items-end justify-between border-b border-ink pb-3">
        <h1 className="display text-5xl sm:text-7xl">Your bag</h1>
        <span className="label text-[0.625rem]">
          {count} {count === 1 ? "item" : "items"}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="py-16">
          <p className="font-serif text-2xl italic">Nothing in here yet.</p>
          <Link
            href="/#catalogue"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm text-paper hover:bg-ink/85"
          >
            Shop the catalogue <ArrowRightIcon width={12} height={12} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 pt-2 lg:grid-cols-12 lg:gap-6">
          <ul className="lg:col-span-8">
            {items.map((item) => {
              const key = itemKey(item);
              return (
                <li key={key} className="flex gap-4 border-b border-line py-4">
                  <Link
                    href={`/products/${item.slug}`}
                    className="size-16 shrink-0 sm:size-20"
                    style={{ background: item.tone }}
                    aria-label={item.name}
                  />
                  <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <Link href={`/products/${item.slug}`} className="text-sm font-medium hover:underline">
                        {item.name}
                      </Link>
                      <p className="font-mono text-[0.625rem] text-muted">
                        No. {item.number}
                        {item.finish && ` · ${item.finish}`} · {formatNaira(item.price)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <QuantityStepper
                        value={item.quantity}
                        onChange={(quantity) => bagStore.setQuantity(key, quantity)}
                        label={`Quantity of ${item.name}`}
                      />
                      <span className="w-20 text-right font-mono text-xs">
                        {formatNaira(item.price * item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => bagStore.remove(key)}
                        className="text-xs text-muted underline underline-offset-2 hover:text-ink"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="self-start border border-ink p-4 lg:col-span-4">
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-mono">{formatNaira(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-muted">
                <dt>Delivery</dt>
                <dd className="text-xs">Calculated at checkout</dd>
              </div>
            </dl>
            <Link
              href="/checkout"
              className="mt-4 flex h-12 items-center justify-center rounded-full bg-ink text-sm text-paper hover:bg-ink/85"
            >
              Checkout · {formatNaira(subtotal)}
            </Link>
            <Link href="/#catalogue" className="mt-3 block text-center text-xs underline underline-offset-2">
              Keep shopping
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
