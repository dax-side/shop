"use client";

import { useEffect } from "react";
import { bagStore, type AccountCart } from "@/lib/bag-store";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Keeps the website's bag in step with the signed-in user's account bag (shared with the app).
// Signed out: does nothing and the bag stays on this browser. Signed in: merges any guest bag once,
// then long-polls /api/cart/changes so items added in the app appear here within a second.
export function CartSync() {
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let version = -1;

    const apply = (cart: AccountCart) => {
      bagStore.applyAccountCart(cart);
      version = Math.max(version, cart.version);
    };

    async function run() {
      const response = await fetch("/api/cart", { cache: "no-store", signal });
      if (!response.ok) return bagStore.switchToGuest();
      apply(await response.json());

      const guest = bagStore.takeGuestBag();
      if (guest.length) {
        const merged = await fetch("/api/cart/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: guest.map(({ slug, finish, quantity }) => ({ slug, finish, quantity })),
          }),
          signal,
        });
        if (merged.ok) apply(await merged.json());
      }

      let failures = 0;
      while (!signal.aborted) {
        if (document.visibilityState === "hidden") {
          await sleep(1000);
          continue;
        }
        try {
          const changes = await fetch(`/api/cart/changes?version=${version}`, { cache: "no-store", signal });
          if (changes.status === 401) return bagStore.switchToGuest();
          if (!changes.ok) throw new Error(String(changes.status));
          const data = await changes.json();
          if (data.changed) apply(data.cart);
          failures = 0;
        } catch {
          if (signal.aborted) return;
          failures += 1;
          await sleep(Math.min(1000 * 2 ** failures, 30_000));
        }
      }
    }

    run().catch(() => {});
    return () => controller.abort();
  }, []);

  return null;
}
