"use client";

import { useSyncExternalStore } from "react";
import { bagStore } from "@/lib/bag-store";

export function useBag() {
  const items = useSyncExternalStore(bagStore.subscribe, bagStore.getSnapshot, bagStore.getServerSnapshot);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { items, count, subtotal };
}
